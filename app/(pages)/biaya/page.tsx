"use client"

import React from "react"
import { Card, Button, Dropdown, Menu, Flex, Grid, Typography, Table, Radio, Input, DatePicker } from "antd"
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
  const screens = useBreakpoint()

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
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal" },
    { title: "Nomor", dataIndex: "nomor", key: "nomor", render: (text: string) => <a>{text}</a> },
    { title: "Referensi", dataIndex: "referensi", key: "referensi" },
    { title: "Penerima", dataIndex: "penerima", key: "penerima" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Sisa Tagihan", dataIndex: "sisaTagihan", key: "sisaTagihan" },
    { title: "Total", dataIndex: "total", key: "total" },
  ]

  const data = [
    {
      key: "1",
      tanggal: "11/11/2024",
      nomor: "EXP/00041",
      referensi: "",
      penerima: "Darijan Purwanto Januari M.T. Rajasa",
      status: "Lunas",
      sisaTagihan: "0",
      total: "639.000",
    },
    {
      key: "2",
      tanggal: "08/11/2024",
      nomor: "EXP/00040",
      referensi: "",
      penerima: "Kamila Puspasari Purwanti",
      status: "Belum Dibayar",
      sisaTagihan: "908.300",
      total: "908.300",
    },
    {
      key: "3",
      tanggal: "07/11/2024",
      nomor: "EXP/00039",
      referensi: "",
      penerima: "Agnes Riyanti Nababan",
      status: "Lunas",
      sisaTagihan: "0",
      total: "1.629.000",
    },
    {
      key: "4",
      tanggal: "07/11/2024",
      nomor: "EXP/00038",
      referensi: "",
      penerima: "Darijan Purwanto Januari M.T. Rajasa",
      status: "Lunas",
      sisaTagihan: "0",
      total: "873.000",
    },
    {
      key: "5",
      tanggal: "06/11/2024",
      nomor: "EXP/00037",
      referensi: "",
      penerima: "Agnes Riyanti Nababan",
      status: "Belum Dibayar",
      sisaTagihan: "620.000",
      total: "620.000",
    },
    {
      key: "6",
      tanggal: "06/11/2024",
      nomor: "EXP/00036",
      referensi: "",
      penerima: "Cinta Anggraini S.T. Purwanti",
      status: "Belum Dibayar",
      sisaTagihan: "2.187.000",
      total: "2.187.000",
    },
  ]

  return (
    <div>
      {/* Top Card with Header */}
      <Card className="mb-5 rounded-xl">
        <Flex justify="space-between" align="center">
          <Typography.Text className="text-2xl font-semibold">Biaya</Typography.Text>
          <Flex gap="small">
            <Dropdown overlay={laporanMenu} trigger={["click"]}>
              <Button shape="round" icon={<BarChartOutlined />}>
                Lihat Laporan <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={importMenu} trigger={["click"]}>
              <Button shape="round" icon={<UploadOutlined />}>
                Import <DownOutlined />
              </Button>
            </Dropdown>
            <Button shape="round" icon={<PrinterOutlined />}>
              Print
            </Button>
            <Button shape="round" type="primary" icon={<PlusOutlined />}>
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
          <Button icon={<FilterOutlined />} shape="round">
            Filter
          </Button>
          <Button icon={<UnorderedListOutlined />} shape="round"></Button>
        </Flex>
        <Flex gap="small" align="center">
          <Input placeholder="Cari" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <RangePicker style={{ borderRadius: "8px" }} />
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
      <Card className="rounded-xl">
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}

export default BiayaPage
