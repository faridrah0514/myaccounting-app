"use client"

import React, { useState, useEffect } from "react"
import { Table, Input, Tag, Card, Button, Dropdown, Menu, Flex, Radio, Switch, Typography, message } from "antd"
import { PlusOutlined, PrinterOutlined, UnorderedListOutlined } from "@ant-design/icons"
import TambahKontakDrawer from "@/app/components/Contact/TambahKontakDrawer"
import type { ContactType } from "@/app/types/types"

import type { ColumnsType } from "antd/es/table"

const { Search } = Input

const stats: { label: string; value: string; color: string; count: number }[] = [
  { label: "Anda Hutang", value: "28.997.398", color: "bg-yellow-500", count: 46 },
  { label: "Mereka Hutang", value: "36.846.291", color: "bg-red-500", count: 24 },
  { label: "Pembayaran Diterima", value: "38.228.069", color: "bg-orange-500", count: 24 },
  { label: "Hutang Anda Jatuh Tempo", value: "28.997.398", color: "bg-blue-500", count: 46 },
  { label: "Hutang Mereka Jatuh Tempo", value: "36.846.291", color: "bg-pink-500", count: 24 },
  { label: "Pembayaran Dikirim", value: "35.999.212", color: "bg-green-500", count: 47 },
]

const KontakPage: React.FC = () => {
  // const router = useRouter()
  const [visibleColumns, setVisibleColumns] = useState({
    nama: true,
    tipeKontak: true,
    perusahaan: true,
    alamat: true,
    email: true,
    telepon: true,
    andaHutang: true,
    merekaHutang: true,
  })
  // const [activeTab, setActiveTab] = useState<string>("Semua")
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [contactData, setContactData] = useState<ContactType[]>([])

  type ColumnKeys = keyof typeof visibleColumns

  const handleColumnToggle = (key: ColumnKeys) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const columns: ColumnsType<ContactType> = [
    { title: "Nama", dataIndex: "name", key: "name", hidden: !visibleColumns.nama },
    {
      title: "Tipe Kontak",
      dataIndex: "contact_type",
      key: "contact_type",
      hidden: !visibleColumns.tipeKontak,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    { title: "Perusahaan", dataIndex: "company", key: "company", hidden: !visibleColumns.perusahaan },
    { title: "Alamat", dataIndex: "address", key: "address", hidden: !visibleColumns.alamat },
    { title: "Email", dataIndex: "email", key: "email", hidden: !visibleColumns.email },
    { title: "Telepon", dataIndex: "phone", key: "phone", hidden: !visibleColumns.telepon },
    { title: "Anda Hutang", dataIndex: "andaHutang", key: "andaHutang", hidden: !visibleColumns.andaHutang },
    { title: "Mereka Hutang", dataIndex: "merekaHutang", key: "merekaHutang", hidden: !visibleColumns.merekaHutang },
  ].filter((col) => !col.hidden)

  const columnFilterMenu = (
    <Menu>
      {Object.keys(visibleColumns).map((key) => (
        <Menu.Item key={key}>
          <Switch
            checked={visibleColumns[key as keyof typeof visibleColumns]}
            onChange={() => handleColumnToggle(key as ColumnKeys)}
            size="small"
            className="mr-2"
          />
          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
        </Menu.Item>
      ))}
    </Menu>
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/contact")
        const result = await response.json()
        setContactData(result.contacts.map((contact: ContactType, index: number) => ({ ...contact, key: index })))
      } catch (error) {
        message.error(`Failed to fetch contact data: ${(error as Error).message}`)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Card className="mb-5 rounded-xl">
        <Flex justify="space-between" align="center">
          <Typography.Text className="text-2xl font-semibold">Kontak</Typography.Text>
          <Flex gap="small">
            <Button icon={<PrinterOutlined />}>Print</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>
              Tambah Kontak
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Flex wrap="wrap" gap="large" className="mb-6">
        {stats.map((card, index) => (
          <Card key={index} className="rounded-xl shadow-sm">
            <Flex align="center">
              <div
                className={`flex justify-center items-center w-10 h-10 rounded-full text-white font-semibold mr-4 ${card.color}`}
              >
                {card.count}
              </div>
              <div>
                <div className="text-lg font-semibold">{card.value}</div>
                <div className="text-gray-500">{card.label}</div>
              </div>
            </Flex>
          </Card>
        ))}
      </Flex>

      <Flex className="mb-3" justify="space-between">
        <Flex gap="small">
          <Dropdown overlay={columnFilterMenu} trigger={["click"]}>
            <Button icon={<UnorderedListOutlined />} />
          </Dropdown>
        </Flex>
        <Search placeholder="Cari" onSearch={(value) => console.log("Search:", value)} style={{ width: 200 }} />
      </Flex>
      <Radio.Group
        defaultValue="Semua"
        buttonStyle="solid"
        className="mb-4"
        // onChange={(e) => setActiveTab(e.target.value)}
      >
        <Radio.Button value="Semua">Semua</Radio.Button>
        <Radio.Button value="Vendor">Vendor</Radio.Button>
        <Radio.Button value="Pegawai">Pegawai</Radio.Button>
        <Radio.Button value="Pelanggan">Pelanggan</Radio.Button>
        <Radio.Button value="Lainnya">Lainnya</Radio.Button>
      </Radio.Group>

      {/* Table Section */}
      <Card className="rounded-xl" style={{ overflowX: "auto" }}>
        <Table<ContactType> columns={columns} dataSource={contactData} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      {/* Tambah Kontak Drawer */}
      <TambahKontakDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={(data: ContactType[]) => {
          setContactData(data as ContactType[])
          message.success("Kontak berhasil ditambahkan")
          setDrawerVisible(false)
        }}
      />
    </div>
  )
}

export default KontakPage
