// import React from "react"

// const TagihanPage: React.FC = () => {
//   return (
//     <div>
//       <h1>Tagihan Page</h1>
//       <p>This is a dummy page for Tagihan.</p>
//     </div>
//   )
// }

// export default TagihanPage

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

const TagihanPage: React.FC = () => {
  const [data, setData] = useState<PemesananData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>("Semua")
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, "year"), dayjs()])
  const [visibleColumns, setVisibleColumns] = useState({
    nomor: true,
    referensi: true,
    namaGudang: true,
    salesPerson: true,
    tanggalTransaksi: true,
    tanggalPengiriman: true,
    tanggalPelunasan: true,
    termin: true,
    status: true,
    totalSebelumPajak: true,
    statusPrint: true,
    attachment: true,
    nomorPO: true,
    pelanggan: true,
    kuantitas: true,
    tanggalJatuhTempo: true,
    tanggalPembayaran: true,
    jatuhTempo: true,
    tag: true,
    sisaTagihan: true,
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
      title: "Tanggal Transaksi",
      dataIndex: "tanggalTransaksi",
      key: "tanggalTransaksi",
      visible: visibleColumns.tanggalTransaksi,
    },
    {
      title: "Tanggal Pengiriman",
      dataIndex: "tanggalPengiriman",
      key: "tanggalPengiriman",
      visible: visibleColumns.tanggalPengiriman,
    },
    {
      title: "Tanggal Pelunasan",
      dataIndex: "tanggalPelunasan",
      key: "tanggalPelunasan",
      visible: visibleColumns.tanggalPelunasan,
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
      title: "Total Sebelum Pajak",
      dataIndex: "totalSebelumPajak",
      key: "totalSebelumPajak",
      visible: visibleColumns.totalSebelumPajak,
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
      title: "Nomor PO",
      dataIndex: "nomorPO",
      key: "nomorPO",
      visible: visibleColumns.nomorPO,
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
      title: "Kuantitas",
      dataIndex: "kuantitas",
      key: "kuantitas",
      visible: visibleColumns.kuantitas,
    },
    {
      title: "Tanggal Jatuh Tempo",
      dataIndex: "tanggalJatuhTempo",
      key: "tanggalJatuhTempo",
      visible: visibleColumns.tanggalJatuhTempo,
    },
    {
      title: "Tanggal Pembayaran",
      dataIndex: "tanggalPembayaran",
      key: "tanggalPembayaran",
      visible: visibleColumns.tanggalPembayaran,
    },
    {
      title: "Jatuh Tempo",
      dataIndex: "jatuhTempo",
      key: "jatuhTempo",
      visible: visibleColumns.jatuhTempo,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      visible: visibleColumns.tag,
    },
    {
      title: "Sisa Tagihan",
      dataIndex: "sisaTagihan",
      key: "sisaTagihan",
      visible: visibleColumns.sisaTagihan,
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
            Tambah Tagihan
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
            <Radio.Button value="Belum Dibayar">Belum Dibayar</Radio.Button>
            <Radio.Button value="Dibayar Sebagian">Dibayar Sebagian</Radio.Button>
            <Radio.Button value="Lunas">Lunas</Radio.Button>
            <Radio.Button value="Void">Void</Radio.Button>
            <Radio.Button value="Jatuh Tempo">Jatuh Tempo</Radio.Button>
            <Radio.Button value="Retur">Retur</Radio.Button>
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

export default TagihanPage
