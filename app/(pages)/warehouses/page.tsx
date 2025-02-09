"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
  Switch,
  Typography,
  Input,
  Space,
  Table,
  Divider,
  Drawer,
  Form,
  message,
} from "antd"
import {
  PlusOutlined,
  PrinterOutlined,
  FilterOutlined,
  BarChartOutlined,
  DownOutlined,
  EllipsisOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { WarehouseType } from "@/app/types/types"

const { Search } = Input

const stats = [
  { label: "Total Stok", value: "12,439", color: "bg-green-500", count: 12 },
  { label: "Total Nilai Produk", value: "18,073,042", color: "bg-yellow-500", count: 18 },
  { label: "Total HPP", value: "102,763", color: "bg-red-500", count: 10 },
]

const InventoryWarehouseUI: React.FC = () => {
  const [isStockPerWarehouse, setIsStockPerWarehouse] = useState(false)
  const [searchText, setSearchText] = useState("")
  // interface Warehouse {
  //   warehouse_name: string
  //   warehouse_code: string
  //   description?: string
  // }

  const [warehouseData, setWarehouseData] = useState<WarehouseType[]>([])
  const [drawerVisible, setDrawerVisible] = useState(false)

  const columns: ColumnsType<any> = [
    {
      title: "Nama Gudang",
      dataIndex: "warehouse_name",
      key: "warehouse_name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Kode",
      dataIndex: "warehouse_code",
      key: "warehouse_code",
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
    },
  ]

  const fetchWarehouseData = async () => {
    try {
      const response = await fetch("/api/warehouses")
      const result = await response.json()
      // const validatedData = WarehouseSchema.parse(result.warehouses)
      // setWarehouseData(validatedData.warehouses)
      setWarehouseData(result.warehouses)
    } catch (error) {
      message.error(`Failed to fetch warehouse data: ${(error as Error).message}`)
    }
  }

  useEffect(() => {
    fetchWarehouseData()
  }, [])

  const filterMenu = (
    <Menu>
      <Menu.Item key="1">Filter by Stock</Menu.Item>
      <Menu.Item key="2">Filter by Location</Menu.Item>
    </Menu>
  )

  const laporanMenu = (
    <Menu>
      <Menu.Item key="1">Lihat Laporan 1</Menu.Item>
      <Menu.Item key="2">Lihat Laporan 2</Menu.Item>
    </Menu>
  )

  const handleDrawerClose = () => {
    setDrawerVisible(false)
  }

  const handleDrawerSubmit = async (values: any) => {
    try {
      const response = await fetch("/api/warehouses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to add warehouse")
      }

      const result = await response.json()
      message.success("Warehouse added successfully")

      // Refresh data
      setWarehouseData(result.warehouses)
      setDrawerVisible(false)
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={4}>Inventori</Typography.Title>
          </Col>
          <Col>
            <Space>
              <Dropdown overlay={laporanMenu} trigger={["click"]}>
                <Button>
                  <Space>
                    <BarChartOutlined /> Lihat Laporan
                    <Divider type="vertical" />
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)} disabled>
                Tambah Gudang
              </Button>
              <Button icon={<PrinterOutlined />}>Print</Button>
              <Button icon={<EllipsisOutlined />} />
            </Space>
          </Col>
        </Row>
      </Card>

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
            <Switch checked={isStockPerWarehouse} onChange={(checked) => setIsStockPerWarehouse(checked)} />
            <span className="ml-2">Tampilkan stok per gudang</span>
          </Space>
        </Col>
        <Col>
          <Search placeholder="Cari" onSearch={(value) => setSearchText(value)} style={{ width: 200 }} />
        </Col>
      </Row>

      <Card className="rounded-xl" style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={warehouseData?.filter((item) =>
            item.warehouse_name.toLowerCase().includes(searchText.toLowerCase())
          )}
          pagination={{ pageSize: 100 }}
        />
      </Card>

      <Drawer
        title="Tambah Inventori"
        visible={drawerVisible}
        onClose={handleDrawerClose}
        footer={
          <Row justify="end">
            <Space>
              <Button onClick={handleDrawerClose}>Batal</Button>
              <Button type="primary" form="addInventoryForm" htmlType="submit">
                Tambah
              </Button>
            </Space>
          </Row>
        }
      >
        <Form id="addInventoryForm" layout="vertical" onFinish={handleDrawerSubmit}>
          <Form.Item
            name="warehouse_name"
            label="Nama Gudang"
            rules={[{ required: true, message: "Nama Gudang harus diisi" }]}
          >
            <Input placeholder="Nama Gudang" />
          </Form.Item>
          <Form.Item name="warehouse_code" label="Kode" rules={[{ required: true, message: "Kode harus diisi" }]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi">
            <Input.TextArea placeholder="Deskripsi" />
          </Form.Item>
        </Form>
      </Drawer>
    </Space>
  )
}

export default InventoryWarehouseUI
