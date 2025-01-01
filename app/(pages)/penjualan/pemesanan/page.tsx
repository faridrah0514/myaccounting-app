"use client"

import React, { useState, useEffect } from "react"
import {
  Table,
  Card,
  Button,
  Input,
  DatePicker,
  Radio,
  Dropdown,
  Space,
  Typography,
  Select,
  Col,
  Row,
  Form,
  Menu,
  Switch,
} from "antd"
import { PlusOutlined, PrinterOutlined, FilterOutlined, DownOutlined, BarsOutlined } from "@ant-design/icons"
import dayjs, { Dayjs } from "dayjs"

const { RangePicker } = DatePicker
const { Text } = Typography
const { Option } = Select

interface PemesananData {
  key: string
  nomor: string
  pelanggan: string
  perusahaan: string
  referensi: string
  tanggal: string
  tanggalJatuhTempo: string
  status: string
  dp: number
  total: number
}

const PemesananPage: React.FC = () => {
  const [data, setData] = useState<PemesananData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>("Semua")
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, "year"), dayjs()])
  const [visibleColumns, setVisibleColumns] = useState({
    nomor: true,
    referensi: true,
    belumDikirim: true,
    pelanggan: true,
    tanggalTransaksi: true,
    tanggalJatuhTempo: true,
    termin: true,
    status: true,
    dp: true,
    nominalBelumDitagih: true,
    statusPrint: true,
    attachment: true,
    kuantitas: true,
    namaGudang: true,
    salesPerson: true,
    tag: true,
    statusPembayaran: true,
    totalSebelumPajak: true,
    total: true,
    deskripsiItem: true,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      // Replace with actual API call
      const response = await fetch("/api/penjualan/pemesanan")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) {
      setDateRange(dates)
      // Add filter logic here if needed
    }
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    // Add filter logic here if needed
  }

  const columns = [
    {
      title: "Nomor",
      dataIndex: "nomor",
      key: "nomor",
      render: (text: string) => <a href={`/penjualan/pemesanan/${text}`}>{text}</a>,
      visible: visibleColumns.nomor,
      fixed: "left",
    },
    {
      title: "Referensi",
      dataIndex: "referensi",
      key: "referensi",
      visible: visibleColumns.referensi,
    },
    {
      title: "Belum Dikirim",
      dataIndex: "belumDikirim",
      key: "belumDikirim",
      visible: visibleColumns.belumDikirim,
    },
    {
      title: "Pelanggan",
      dataIndex: "pelanggan",
      key: "pelanggan",
      render: (_: any, record: PemesananData) => (
        <div>
          <Text>{record.pelanggan}</Text>
          <br />
          <Text type="secondary">{record.perusahaan}</Text>
        </div>
      ),
      visible: visibleColumns.pelanggan,
    },
    {
      title: "Tanggal Transaksi",
      dataIndex: "tanggalTransaksi",
      key: "tanggalTransaksi",
      visible: visibleColumns.tanggalTransaksi,
    },
    {
      title: "Tanggal Jatuh Tempo",
      dataIndex: "tanggalJatuhTempo",
      key: "tanggalJatuhTempo",
      visible: visibleColumns.tanggalJatuhTempo,
    },
    {
      title: "Termin",
      dataIndex: "termin",
      key: "termin",
      visible: visibleColumns.termin,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "Selesai" ? "green" : "orange"
        return <Text style={{ color }}>{status}</Text>
      },
      visible: visibleColumns.status,
    },
    {
      title: "DP",
      dataIndex: "dp",
      key: "dp",
      render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
      visible: visibleColumns.dp,
    },
    {
      title: "Nominal Belum Ditagih",
      dataIndex: "nominalBelumDitagih",
      key: "nominalBelumDitagih",
      visible: visibleColumns.nominalBelumDitagih,
    },
    {
      title: "Status Print",
      dataIndex: "statusPrint",
      key: "statusPrint",
      visible: visibleColumns.statusPrint,
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      key: "attachment",
      visible: visibleColumns.attachment,
    },
    {
      title: "Kuantitas",
      dataIndex: "kuantitas",
      key: "kuantitas",
      visible: visibleColumns.kuantitas,
    },
    {
      title: "Nama Gudang",
      dataIndex: "namaGudang",
      key: "namaGudang",
      visible: visibleColumns.namaGudang,
    },
    {
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
      visible: visibleColumns.salesPerson,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      visible: visibleColumns.tag,
    },
    {
      title: "Status Pembayaran",
      dataIndex: "statusPembayaran",
      key: "statusPembayaran",
      visible: visibleColumns.statusPembayaran,
    },
    {
      title: "Total Sebelum Pajak",
      dataIndex: "totalSebelumPajak",
      key: "totalSebelumPajak",
      visible: visibleColumns.totalSebelumPajak,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
      visible: visibleColumns.total,
    },
    {
      title: "Deskripsi Item",
      dataIndex: "deskripsiItem",
      key: "deskripsiItem",
      visible: visibleColumns.deskripsiItem,
    },
  ].filter((col) => col.visible)

  const menu = {
    items: [{ key: "1", label: "Pemesanan per Produk" }],
  }

  type ColumnKeys = keyof typeof visibleColumns

  const handleColumnToggle = (key: ColumnKeys) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const columnFilterMenu = (
    <Menu>
      <Row gutter={[16, 16]}>
        {Object.keys(visibleColumns).map((key, index) => (
          <Col span={12} key={index}>
            <Menu.Item key={key}>
              <Switch
                checked={visibleColumns[key as keyof typeof visibleColumns]}
                onChange={() => handleColumnToggle(key as ColumnKeys)}
                size="small"
                className="mr-2"
              />
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </Menu.Item>
          </Col>
        ))}
      </Row>
    </Menu>
  )

  return (
    <Card
      title="Pemesanan"
      extra={
        <Space>
          <Dropdown menu={menu} trigger={["click"]}>
            <Button>
              Lihat Laporan <DownOutlined />
            </Button>
          </Dropdown>
          <Button type="primary" icon={<PlusOutlined />}>
            Tambah Pemesanan
          </Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
        </Space>
      }
    >
      <Row justify="space-between" style={{ marginBottom: 16 }} align="middle" gutter={16}>
        <Col>
          <Space>
            <Dropdown
              dropdownRender={() => (
                <div className="bg-white border border-gray-200 rounded-xl" style={{ minWidth: 1500 }}>
                  <Form layout="vertical" style={{ padding: 16 }}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item label="Tanggal Pembayaran">
                          <RangePicker placeholder={["Tanggal awal", "Tanggal akhir"]} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item label="Tanggal Jatuh Tempo">
                          <RangePicker placeholder={["Tanggal awal", "Tanggal akhir"]} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Grup Kontak">
                          <Select placeholder="Semua Grup" style={{ width: "100%" }}>
                            <Option value="">Semua Grup</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Pelanggan">
                          <Select placeholder="Semua Kontak" style={{ width: "100%" }}>
                            <Option value="">Semua Kontak</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Tag">
                          <Select placeholder="Pilih Tag" style={{ width: "100%" }}>
                            <Option value="">Pilih Tag</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Sales Person">
                          <Select placeholder="Pilih Sales Person" style={{ width: "100%" }}>
                            <Option value="">Pilih Sales Person</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Produk">
                          <Select placeholder="Pilih Produk" style={{ width: "100%" }}>
                            <Option value="">Pilih Produk</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Termin">
                          <Select placeholder="Pilih Termin" style={{ width: "100%" }}>
                            <Option value="">Pilih Termin</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="Gudang">
                          <Select placeholder="Pilih Gudang" style={{ width: "100%" }}>
                            <Option value="">Pilih Gudang</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Ekspedisi">
                          <Select placeholder="Pilih Ekspedisi" style={{ width: "100%" }}>
                            <Option value="">Pilih Ekspedisi</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <Button icon={<FilterOutlined />}>Filter</Button>
            </Dropdown>
            <Dropdown overlay={columnFilterMenu} trigger={["click"]} placement="bottomLeft">
              <Button icon={<BarsOutlined />} />
            </Dropdown>
          </Space>
        </Col>
        <Col>
          <Space>
            <Input.Search placeholder="Cari" style={{ width: 200 }} />
            <RangePicker value={dateRange} onChange={handleDateChange} />
          </Space>
        </Col>
      </Row>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Row>
          <Radio.Group value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}>
            <Radio.Button value="Semua">Semua</Radio.Button>
            <Radio.Button value="Open">Open</Radio.Button>
            <Radio.Button value="Dikirim Sebagian">Dikirim Sebagian</Radio.Button>
            <Radio.Button value="Selesai">Selesai</Radio.Button>
            <Radio.Button value="Jatuh Tempo">Jatuh Tempo</Radio.Button>
            <Radio.Button value="Transaksi Berulang">Transaksi Berulang</Radio.Button>
          </Radio.Group>
        </Row>
      </Space>
      <Table
        rowSelection={{ type: "checkbox" }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 15 }}
        footer={() => <Text>Total {data.length} data</Text>}
        scroll={{ x: "max-content" }}
      />
    </Card>
  )
}

export default PemesananPage
