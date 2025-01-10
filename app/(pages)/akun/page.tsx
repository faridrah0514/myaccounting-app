"use client"

import React, { useState } from "react"
import { Table, Button, Dropdown, Space, Card, Typography, Row, Col, Input, Menu, Drawer, Form, Select } from "antd"
import {
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  PrinterOutlined,
  ImportOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography
const { Option } = Select

interface AkunData {
  key: string
  kode: string
  nama: string
  kategori: string
  saldo: string
}

const columns: ColumnsType<AkunData> = [
  {
    title: "Kode",
    dataIndex: "kode",
    key: "kode",
    sorter: true,
  },
  {
    title: "Nama",
    dataIndex: "nama",
    key: "nama",
    sorter: true,
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Kategori",
    dataIndex: "kategori",
    key: "kategori",
    sorter: true,
  },
  {
    title: "Saldo",
    dataIndex: "saldo",
    key: "saldo",
    sorter: true,
    render: (text: string) => `Rp ${text}`,
  },
]

const data: AkunData[] = [
  { key: "1", kode: "1-10001", nama: "Kas", kategori: "Kas & Bank", saldo: "29,276,800" },
  { key: "2", kode: "1-10002", nama: "Rekening BCA", kategori: "Kas & Bank", saldo: "50,000" },
  { key: "3", kode: "1-10003", nama: "Rekening Mandiri", kategori: "Kas & Bank", saldo: "54,500" },
  { key: "4", kode: "1-10100", nama: "Piutang Usaha", kategori: "Akun Piutang", saldo: "0" },
  { key: "5", kode: "1-10101", nama: "Piutang Belum Ditagih", kategori: "Akun Piutang", saldo: "22,702,750" },
  { key: "6", kode: "1-10200", nama: "Persediaan Barang", kategori: "Persediaan", saldo: "447,017,000" },
  // Add more rows as necessary
]

const reportMenu = (
  <Menu>
    <Menu.Item key="1">Buku Besar</Menu.Item>
  </Menu>
)

const AkunPage: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const showDrawer = () => {
    setDrawerVisible(true)
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
  }

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Akun</Title>
        </Col>
        <Col>
          <Space>
            <Dropdown overlay={reportMenu}>
              <Button>
                Lihat Laporan <DownOutlined />
              </Button>
            </Dropdown>
            <Button icon={<SettingOutlined />}>Saldo Awal</Button>
            <Dropdown.Button overlay={<></>} icon={<DownOutlined />}>
              Panduan
            </Dropdown.Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
              Tambah Akun
            </Button>
            <Button>Jurnal Umum</Button>
            <Button>Tutup Buku</Button>
            <Button icon={<ImportOutlined />}>Import</Button>
            <Button icon={<PrinterOutlined />}>Print</Button>
          </Space>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Col>
        <Col>
          <Input.Search placeholder="Cari Akun" allowClear style={{ width: 300 }} />
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />

      <Drawer title="Tambah Akun" placement="right" onClose={closeDrawer} visible={drawerVisible} width={400}>
        <Form layout="vertical">
          <Form.Item label="Nama" name="nama" rules={[{ required: true, message: "Nama wajib diisi" }]}>
            <Input placeholder="Nama" />
          </Form.Item>
          <Form.Item label="Kode" name="kode" rules={[{ required: true, message: "Kode wajib diisi" }]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item label="Kategori" name="kategori" rules={[{ required: true, message: "Kategori wajib diisi" }]}>
            <Select placeholder="Pilih kategori">
              <Option value="kas">Kas & Bank</Option>
              <Option value="piutang">Akun Piutang</Option>
              <Option value="persediaan">Persediaan</Option>
              <Option value="aktiva-lancar">Aktiva Lancar Lainnya</Option>
              <Option value="aktiva-tetap">Aktiva Tetap</Option>
              <Option value="depresiasi">Depresiasi & Amortisasi</Option>
              <Option value="aktiva-lainnya">Aktiva Lainnya</Option>
              <Option value="hutang">Akun Hutang</Option>
              <Option value="kewajiban-lancar">Kewajiban Lancar Lainnya</Option>
              <Option value="kewajiban-panjang">Kewajiban Jangka Panjang</Option>
              <Option value="ekuitas">Ekuitas</Option>
              <Option value="pendapatan">Pendapatan</Option>
              <Option value="harga-pokok">Harga Pokok Penjualan</Option>
              <Option value="beban">Beban</Option>
              <Option value="pendapatan-lainnya">Pendapatan Lainnya</Option>
              <Option value="beban-lainnya">Beban Lainnya</Option>
              <Option value="kartu-kredit">Kartu Kredit</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Sub Akun dari" name="subAkun">
            <Select placeholder="Pilih akun">
              <Option value="akun1">Akun 1</Option>
              <Option value="akun2">Akun 2</Option>
            </Select>
          </Form.Item>
          <Row justify="end">
            <Space>
              <Button onClick={closeDrawer}>Batal</Button>
              <Button type="primary">Tambah</Button>
            </Space>
          </Row>
        </Form>
      </Drawer>
    </Card>
  )
}

export default AkunPage
