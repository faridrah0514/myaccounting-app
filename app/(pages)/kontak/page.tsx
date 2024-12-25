"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, Input, Tag, Card, Button, Dropdown, Menu, Flex, Radio, Switch, Typography } from "antd"
import { PlusOutlined, PrinterOutlined, UnorderedListOutlined } from "@ant-design/icons"
import TambahKontakDrawer from "@/app/components/Kontak/TambahKontakDrawer"

import type { ColumnsType } from "antd/es/table"

interface KontakData {
  key: string
  name: string
  type: string
  company: string
  address: string
  email: string
  phone: string
  andaHutang: number
  merekaHutang: number
}

const { Search } = Input

const stats: { label: string; value: string; color: string; count: number }[] = [
  { label: "Anda Hutang", value: "28.997.398", color: "bg-yellow-500", count: 46 },
  { label: "Mereka Hutang", value: "36.846.291", color: "bg-red-500", count: 24 },
  { label: "Pembayaran Diterima", value: "38.228.069", color: "bg-orange-500", count: 24 },
  { label: "Hutang Anda Jatuh Tempo", value: "28.997.398", color: "bg-blue-500", count: 46 },
  { label: "Hutang Mereka Jatuh Tempo", value: "36.846.291", color: "bg-pink-500", count: 24 },
  { label: "Pembayaran Dikirim", value: "35.999.212", color: "bg-green-500", count: 47 },
]

const data: KontakData[] = [
  {
    key: "1",
    name: "Bella Padmasari S.IP Hidayanto",
    type: "Vendor",
    company: "CV Novitasari Sudiati",
    address: "Kpg. Bak Mandi No. 513, NTT",
    email: "zhutagalung@rahayu.co.id",
    phone: "626884070548",
    andaHutang: 0,
    merekaHutang: 0,
  },
  {
    key: "2",
    name: "Cinta Anggraini S.T. Purwanti",
    type: "Vendor",
    company: "CV Novitasari Tbk",
    address: "Kpg. Ters. Kiaracondong No. 968, Jakarta Timur 43100",
    email: "pertiwi.jagaraga@pradipta.co",
    phone: "625386265599",
    andaHutang: 5121000,
    merekaHutang: 0,
  },
  {
    key: "3",
    name: "Gandi Najmudin Wahyudin",
    type: "Pelanggan",
    company: "Perum Pratiwi Susanti",
    address: "Ds. S. Parman No. 507, Palangka Raya 26274",
    email: "kpernmata@yahoo.co.id",
    phone: "621156061135",
    andaHutang: 2394000,
    merekaHutang: 886560,
  },
]

const KontakPage: React.FC = () => {
  const router = useRouter()
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
  const [activeTab, setActiveTab] = useState<string>("Semua")
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)

  type ColumnKeys = keyof typeof visibleColumns

  const handleColumnToggle = (key: ColumnKeys) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const columns: ColumnsType<KontakData> = [
    { title: "Nama", dataIndex: "name", key: "name", hidden: !visibleColumns.nama },
    {
      title: "Tipe Kontak",
      dataIndex: "type",
      key: "type",
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
        onChange={(e) => setActiveTab(e.target.value)}
      >
        <Radio.Button value="Semua">Semua</Radio.Button>
        <Radio.Button value="Vendor">Vendor</Radio.Button>
        <Radio.Button value="Pegawai">Pegawai</Radio.Button>
        <Radio.Button value="Pelanggan">Pelanggan</Radio.Button>
        <Radio.Button value="Lainnya">Lainnya</Radio.Button>
      </Radio.Group>

      {/* Table Section */}
      <Card className="rounded-xl" style={{ overflowX: "auto" }}>
        <Table<KontakData> columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
      </Card>

      {/* Tambah Kontak Drawer */}
      <TambahKontakDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={() => {
          console.log("Kontak ditambahkan")
          setDrawerVisible(false)
        }}
      />
    </div>
  )
}

export default KontakPage
