"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Button, Dropdown, Menu, Flex, Grid, Typography, Table, Radio, Input, DatePicker, Switch } from "antd"
import {
  PlusOutlined,
  PrinterOutlined,
  UploadOutlined,
  DownOutlined,
  BarChartOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons"

const { useBreakpoint } = Grid
const { RangePicker } = DatePicker

const BiayaPage: React.FC = () => {
  const router = useRouter()
  const screens = useBreakpoint()

  const [visibleColumns, setVisibleColumns] = useState({
    tanggal: true,
    nomor: true,
    referensi: true,
    penerima: true,
    termin: false,
    tag: false,
    status: true,
    tanggalPembayaran: false,
    tanggalPelunasan: false,
    sisaTagihan: true,
    total: true,
  })

  type ColumnKeys = keyof typeof visibleColumns

  const handleColumnToggle = (key: ColumnKeys) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const summaryCards = [
    { color: "bg-yellow-500", label: "Bulan Ini", value: 0, count: 0 },
    { color: "bg-red-500", label: "30 Hari Lalu", value: 0, count: 0 },
    { color: "bg-orange-500", label: "Belum Dibayar", value: 19605400, count: 18 },
    { color: "bg-green-500", label: "Jatuh Tempo", value: 19605400, count: 18 },
  ]

  const importMenu = (
    <Menu>
      <Menu.Item key="1">Import CSV</Menu.Item>
      <Menu.Item key="2">Import Excel</Menu.Item>
    </Menu>
  )

  const laporanMenu = (
    <Menu>
      <Menu.Item key="1">Neraca</Menu.Item>
      <Menu.Item key="2">Arus Kas</Menu.Item>
      <Menu.Item key="3">Ringkasan Bank</Menu.Item>
      <Menu.Item key="4">Buku Besar</Menu.Item>
      <Menu.Item key="5">Jurnal</Menu.Item>
      <Menu.Item key="6">Trial Balance</Menu.Item>
    </Menu>
  )

  const columns = [
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal", hidden: !visibleColumns.tanggal },
    {
      title: "Nomor",
      dataIndex: "nomor",
      key: "nomor",
      hidden: !visibleColumns.nomor,
      render: (text: string) => <a>{text}</a>,
    },
    { title: "Referensi", dataIndex: "referensi", key: "referensi", hidden: !visibleColumns.referensi },
    { title: "Penerima", dataIndex: "penerima", key: "penerima", hidden: !visibleColumns.penerima },
    { title: "Termin", dataIndex: "termin", key: "termin", hidden: !visibleColumns.termin },
    { title: "Tag", dataIndex: "tag", key: "tag", hidden: !visibleColumns.tag },
    { title: "Status", dataIndex: "status", key: "status", hidden: !visibleColumns.status },
    {
      title: "Tanggal Pembayaran",
      dataIndex: "tanggalPembayaran",
      key: "tanggalPembayaran",
      hidden: !visibleColumns.tanggalPembayaran,
    },
    {
      title: "Tanggal Pelunasan",
      dataIndex: "tanggalPelunasan",
      key: "tanggalPelunasan",
      hidden: !visibleColumns.tanggalPelunasan,
    },
    { title: "Sisa Tagihan", dataIndex: "sisaTagihan", key: "sisaTagihan", hidden: !visibleColumns.sisaTagihan },
    { title: "Total", dataIndex: "total", key: "total", hidden: !visibleColumns.total },
  ].filter((column) => !column.hidden)

  const data = [
    {
      key: "1",
      tanggal: "11/11/2024",
      nomor: "EXP/00041",
      referensi: "",
      penerima: "Darijan Purwanto Januari M.T. Rajasa",
      termin: "1",
      status: "Lunas",
      tanggalPembayaran: "11/11/2024",
      tanggalPelunasan: "11/11/2024",
      sisaTagihan: "0",
      total: "639.000",
    },
    {
      key: "2",
      tanggal: "08/11/2024",
      nomor: "EXP/00040",
      referensi: "",
      penerima: "Kamila Puspasari Purwanti",
      termin: "2",
      status: "Belum Dibayar",
      tanggalPembayaran: "",
      tanggalPelunasan: "",
      sisaTagihan: "908.300",
      total: "908.300",
    },
    {
      key: "3",
      tanggal: "07/11/2024",
      nomor: "EXP/00039",
      referensi: "",
      penerima: "Agnes Riyanti Nababan",
      termin: "1",
      status: "Lunas",
      tanggalPembayaran: "07/11/2024",
      tanggalPelunasan: "07/11/2024",
      sisaTagihan: "0",
      total: "1.629.000",
    },
  ]

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
      {/* Top Card with Header */}
      <Card className="mb-5 rounded-xl">
        <Flex justify="space-between" align="center">
          <Typography.Text className="text-2xl font-semibold">Biaya</Typography.Text>
          <Flex gap="small">
            <Dropdown overlay={laporanMenu} trigger={["click"]}>
              <Button icon={<BarChartOutlined />}>
                Lihat Laporan <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={importMenu} trigger={["click"]}>
              <Button icon={<UploadOutlined />}>
                Import <DownOutlined />
              </Button>
            </Dropdown>
            <Button icon={<PrinterOutlined />}>Print</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/biaya/tambah")}>
              Tambah Biaya
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Summary Cards */}
      <Flex wrap="wrap" gap="large">
        {summaryCards.map((card, index) => (
          <Card key={index} className="rounded-xl shadow-sm" style={{ flex: screens.xs ? "100%" : "1" }}>
            <Flex align="center">
              <div
                className={`flex justify-center items-center w-10 h-10 rounded-full text-white font-semibold mr-4 ${card.color}`}
              >
                {card.count}
              </div>
              <div>
                <div className="text-lg font-semibold">{card.value.toLocaleString("id-ID")}</div>
                <div className="text-gray-500">{card.label}</div>
              </div>
            </Flex>
          </Card>
        ))}
      </Flex>

      {/* Table Action Buttons */}
      <Flex className="mt-5 mb-3" justify="space-between" align="center">
        <Flex gap="small">
          <Button icon={<FilterOutlined />}>Filter</Button>
          <Dropdown overlay={columnFilterMenu} trigger={["click"]}>
            <Button icon={<UnorderedListOutlined />}></Button>
          </Dropdown>
        </Flex>
        <Flex gap="small" align="center">
          <Input placeholder="Cari" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <RangePicker />
        </Flex>
      </Flex>

      {/* Table Radio Buttons */}
      <Flex className="mt-3 mb-3" justify="start">
        <Radio.Group defaultValue="semua" buttonStyle="solid" className="overflow-hidden">
          <Radio.Button value="semua" style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
            Semua
          </Radio.Button>
          <Radio.Button value="belum">Belum Dibayar</Radio.Button>
          <Radio.Button value="sebagian">Dibayar Sebagian</Radio.Button>
          <Radio.Button value="lunas">Lunas</Radio.Button>
          <Radio.Button value="jatuh">Jatuh Tempo</Radio.Button>
          <Radio.Button value="berulang" style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }}>
            Transaksi Berulang
          </Radio.Button>
        </Radio.Group>
      </Flex>

      {/* Table Section */}
      <Card className="rounded-xl" style={{ overflowX: "auto" }}>
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 100 }} />
      </Card>
    </div>
  )
}

export default BiayaPage
