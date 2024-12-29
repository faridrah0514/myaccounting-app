"use client"

import React, { useState, useEffect } from "react"
import { Table, Input, Card, Button, Dropdown, Menu, Switch, Typography, message, Row, Col, Space } from "antd"
import { PlusOutlined, PrinterOutlined, UnorderedListOutlined, FilterOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { useRouter } from "next/navigation"
import ProductCategoryListDrawer from "@/app/components/Product/ProductCategoryListDrawer"

const { Search } = Input

const stats = [
  { label: "Produk Stok Tersedia", value: "0", color: "bg-green-500", count: 0 },
  { label: "Produk Stok Hampir Habis", value: "0", color: "bg-yellow-500", count: 0 },
  { label: "Produk Stok Habis", value: "0", color: "bg-red-500", count: 0 },
  { label: "Total Nilai Produk", value: "0", color: "bg-blue-500", count: 0 },
  { label: "Total HPP", value: "0", color: "bg-purple-500", count: 0 },
  { label: "Total Stok", value: "0", color: "bg-orange-500", count: 0 },
  { label: "Total Penjualan", value: "0", color: "bg-pink-500", count: 0 },
  { label: "Total Pembelian", value: "0", color: "bg-green-500", count: 0 },
  { label: "Total Jenis Produk", value: "1", color: "bg-rose-500", count: 1 },
]

const ProductPage: React.FC = () => {
  const router = useRouter()
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    sku: true,
    category: true,
    unit: true,
    purchasePrice: true,
    sellingPrice: true,
    quantity: true,
    hpp: true,
  })
  const [productData, setProductData] = useState()
  const [drawerVisible, setDrawerVisible] = useState(false)

  type ColumnKeys = keyof typeof visibleColumns

  const handleColumnToggle = (key: ColumnKeys) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const columns: ColumnsType<any> = [
    { title: "Nama", dataIndex: "name", key: "name", hidden: !visibleColumns.name },
    { title: "Kode/SKU", dataIndex: "code", key: "code", hidden: !visibleColumns.sku },
    { title: "Kategori", dataIndex: "product_category", key: "product_category", hidden: !visibleColumns.category },
    { title: "Satuan", dataIndex: "product_unit", key: "product_unit", hidden: !visibleColumns.unit },
    { title: "Harga Beli", dataIndex: "purchase_price", key: "purchase_price", hidden: !visibleColumns.purchasePrice },
    { title: "Harga Jual", dataIndex: "sell_price", key: "sell_price", hidden: !visibleColumns.sellingPrice },
    { title: "Qty", dataIndex: "quantity", key: "quantity", hidden: !visibleColumns.quantity },
    { title: "HPP", dataIndex: "hpp", key: "hpp", hidden: !visibleColumns.hpp },
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

  const filterMenu = (
    <Menu>
      <Menu.Item key="1">Kategori: Pilih Kategori</Menu.Item>
      <Menu.Item key="2">Stok: Semua stok</Menu.Item>
      <Menu.Item key="3">Tampilkan Arsip: Tanpa arsip</Menu.Item>
      <Menu.Item key="4">Jual atau Beli: Semua</Menu.Item>
      <Menu.Item key="5">Lacak Stok: Semua</Menu.Item>
      <Menu.Item key="6">Jenis Produk: Semua</Menu.Item>
      <Menu.Item key="7">Foto: Semua</Menu.Item>
    </Menu>
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/product")
        const result = await response.json()
        setProductData(result.products.map((product: any, index: number) => ({ ...product, key: index })))
      } catch (error) {
        message.error(`Failed to fetch product data: ${(error as Error).message}`)
      }
    }

    fetchData()
  }, [])

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4}>Produk</Typography.Title>
          </Col>
          <Col>
            <Space>
              <Button icon={<PrinterOutlined />}>Print</Button>
              <Button icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>
                Kategori
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/produk/tambah")}>
                Tambah Produk
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <ProductCategoryListDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      <div style={{ overflowX: "auto" }}>
        <Row gutter={16} wrap={false} style={{ flexWrap: "nowrap" }}>
          {stats.map((card, index) => (
            <Col key={index} flex="0 0 auto" style={{ minWidth: 300 }}>
              <Card className="rounded-xl shadow-sm" style={{ width: "100%", minHeight: "100px" }}>
                <Space align="center">
                  <div
                    className={`flex justify-center items-center w-10 h-10 rounded-full text-white font-semibold ${card.color}`}
                  >
                    {card.count}
                  </div>
                  <Space direction="vertical" size={0}>
                    <Typography.Text strong>{card.value}</Typography.Text>
                    <Typography.Text type="secondary">{card.label}</Typography.Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Row justify="space-between" align="middle" gutter={16}>
        <Col>
          <Space>
            <Dropdown overlay={filterMenu} trigger={["click"]}>
              <Button icon={<FilterOutlined />}>Filter</Button>
            </Dropdown>
            <Dropdown overlay={columnFilterMenu} trigger={["click"]}>
              <Button icon={<UnorderedListOutlined />} />
            </Dropdown>
          </Space>
        </Col>
        <Col>
          <Search placeholder="Cari" onSearch={(value) => console.log("Search:", value)} style={{ width: 200 }} />
        </Col>
      </Row>

      <Card className="rounded-xl" style={{ overflowX: "auto" }}>
        <Table columns={columns} dataSource={productData} pagination={{ pageSize: 10 }} />
      </Card>
    </Space>
  )
}

export default ProductPage
