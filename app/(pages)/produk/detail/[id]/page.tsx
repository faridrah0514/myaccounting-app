"use client"
import React, { useState, useEffect } from "react"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Card, Row, Col, Button, Dropdown, Menu, Typography, Space, message, Tabs, Table } from "antd"
import { ArrowLeftOutlined, PrinterOutlined, MoreOutlined } from "@ant-design/icons"
import InventoryDetails from "./InventoryDetails"
import { useRouter } from "next/navigation"
import StockAdjustmentDrawer from "@/app/components/Product/StockAdjustmentDrawer"
import type { FinanceAccountType, FinanceAccountCategoryType, WarehouseType } from "@/app/types/types"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

const ProductDetailPage = ({ params }: { params: { id: number } }) => {
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false)
  const [accountData, setAccountData] = useState<{
    finance_accounts: FinanceAccountType[]
    finance_account_categories: FinanceAccountCategoryType[]
  }>()
  const [warehouseData, setWarehouseData] = useState<WarehouseType[]>()
  const router = useRouter()
  const { id } = params

  const handleOpenAdjustment = () => setIsAdjustmentOpen(true)
  const handleCloseAdjustment = () => setIsAdjustmentOpen(false)

  const fetchData = async () => {
    try {
      const [accountData, warehouseData] = await Promise.all([
        fetch("/api/accounts").then((res) => res.json()),
        fetch("/api/warehouses").then((res) => res.json()),
      ])

      setAccountData({
        finance_accounts: accountData.finance_accounts.map((account: FinanceAccountType, index: number) => ({
          ...account,
          key: index,
        })),
        finance_account_categories: accountData.finance_account_categories.map(
          (category: FinanceAccountCategoryType, index: number) => ({
            ...category,
            key: index,
          })
        ),
      })
      setWarehouseData(warehouseData.warehouses)
    } catch (error) {
      message.error("Gagal mengambil data akun: " + (error as Error).message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const chartData = {
    labels: ["Agt", "Sep", "Okt", "Nov", "Des", "Jan"],
    datasets: [
      {
        label: "Penjualan",
        data: [0, 0, 0, 0, 27440000, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Pembelian",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `Rp ${value.toLocaleString()}`
          },
        },
      },
    },
  }

  const movementChartData = {
    labels: ["Agt", "Sep", "Okt", "Nov", "Des", "Jan"],
    datasets: [
      {
        type: "line",
        label: "Net",
        data: [0, 0, 0, 0, 100, -20],
        borderColor: "#42A5F5",
        borderWidth: 2,
        fill: false,
      },
      {
        type: "bar",
        label: "In",
        data: [0, 0, 0, 0, 120, 0],
        backgroundColor: "#26A69A",
      },
      {
        type: "bar",
        label: "Out",
        data: [0, 0, 0, 0, -20, -20],
        backgroundColor: "#EF5350",
      },
    ],
  }

  const movementChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const locationDonutData = {
    labels: ["PUSAT"],
    datasets: [
      {
        data: [89],
        backgroundColor: ["#f06292"],
        hoverBackgroundColor: ["#e91e63"],
      },
    ],
  }

  const locationDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }

  const stats = [
    { color: "#d32f2f", value: 445000000, prefix: 89, title: "Stok di tangan" },
    { color: "#f9a825", value: 27440000, prefix: 4, title: "Penjualan" },
    { color: "#43a047", value: 0, prefix: 0, title: "Pembelian" },
    { color: "#f4511e", value: 5000000, title: "HPP" },
  ]

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      key: "tanggal",
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Kuantitas",
      dataIndex: "kuantitas",
      key: "kuantitas",
    },
    {
      title: "Harga",
      dataIndex: "harga",
      key: "harga",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ]

  const data = [
    {
      key: "1",
      tanggal: "29/12/2024",
      deskripsi: "Pemesanan Penjualan (SO/00003) - asdasd lala",
      reference: "ssss",
      kuantitas: 10,
      harga: "Rp 7.500.000",
      total: "Rp 75.000.000",
    },
    {
      key: "2",
      tanggal: "28/12/2024",
      deskripsi: "Tagihan Penjualan (INV/00002) - BRIN Farham",
      reference: "",
      kuantitas: 4,
      harga: "Rp 7.000.000",
      total: "Rp 27.440.000",
    },
  ]

  return (
    <Space direction="vertical" style={{ width: "100%", padding: "24px" }} size="large">
      <Row gutter={16} align="top" justify="space-between">
        <Col>
          <Space direction="vertical" size={0}>
            <Typography.Title level={2} style={{ marginBottom: 0 }}>
              farid-laptop-private
            </Typography.Title>
            <Typography.Text type="secondary">SKU/{id}</Typography.Text>
          </Space>
        </Col>
        <Col>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            style={{ backgroundColor: "#FF9F43", color: "#fff", borderRadius: "5px" }}
            onClick={() => router.back()}
          >
            Kembali
          </Button>
        </Col>
      </Row>
      <Card
        title={
          <Space align="center" style={{ justifyContent: "flex-end", width: "100%" }}>
            <Button type="primary" style={{ marginRight: "8px" }} onClick={handleOpenAdjustment}>
              + Penyesuaian Stok
            </Button>
            <Button icon={<PrinterOutlined />} style={{ marginRight: "8px" }}>
              Print
            </Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">Option 1</Menu.Item>
                  <Menu.Item key="2">Option 2</Menu.Item>
                </Menu>
              }
            >
              <Button type="text">
                <MoreOutlined style={{ fontSize: "20px", fontWeight: "bold" }} />
              </Button>
            </Dropdown>
          </Space>
        }
      >
        <Row gutter={16} style={{ display: "flex", alignItems: "stretch", marginTop: "10px" }}>
          <Col span={18} style={{ display: "flex", flexDirection: "column" }}>
            <Row gutter={16}>
              {stats.map((stat, index) => (
                <Col span={6} key={index}>
                  <Card>
                    <Space align="center" size="middle">
                      <Card
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: stat.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "16px",
                          textAlign: "center",
                        }}
                      >
                        {stat.prefix || 0}
                      </Card>
                      <Space direction="vertical" size={0}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          Rp {stat.value.toLocaleString("id-ID")}
                        </Typography.Title>
                        <Typography.Text>{stat.title}</Typography.Text>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row>
              <Col span={24}>
                <Typography.Title className="mt-5 mb-5" level={4}>
                  Penjualan Pembelian
                </Typography.Title>
                <div style={{ flex: 1, display: "flex" }}>
                  <Bar data={chartData} options={chartOptions} style={{ flex: 1 }} />
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={16}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Pergerakan Stock
                  </Typography.Title>
                  <Dropdown
                    menu={{
                      items: [
                        { key: "daily", label: "Harian" },
                        { key: "monthly", label: "Bulanan" },
                        { key: "yearly", label: "Tahunan" },
                      ],
                      onClick: ({ key }) => {
                        // Handle period change here
                        console.log("Selected period:", key)
                      },
                    }}
                    trigger={["click"]}
                  >
                    <Button type="text">
                      <MoreOutlined style={{ fontSize: "15px", fontWeight: "bold" }} />
                    </Button>
                  </Dropdown>
                </div>
                <div style={{ height: "400px" }}>
                  <Bar data={movementChartData} options={movementChartOptions} />
                </div>
              </Col>
              <Col span={8}>
                <Typography.Title level={4}>Lokasi Gudang</Typography.Title>
                <div style={{ height: "400px" }}>
                  <Doughnut data={locationDonutData} options={locationDonutOptions} />
                </div>
              </Col>
            </Row>
            <Tabs defaultActiveKey="1" style={{ marginTop: "24px" }}>
              <Tabs.TabPane tab="Transaksi Terkini" key="1">
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Pergerakan Stok" key="2">
                <Typography.Text>Content for Pergerakan Stok</Typography.Text>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Transfer Gudang" key="3">
                <Typography.Text>Content for Transfer Gudang</Typography.Text>
              </Tabs.TabPane>
            </Tabs>
          </Col>
          <Col span={6} style={{ display: "flex", flexDirection: "column" }}>
            <InventoryDetails />
          </Col>
        </Row>
      </Card>
      <StockAdjustmentDrawer
        productId={id}
        visible={isAdjustmentOpen}
        onClose={handleCloseAdjustment}
        accountData={accountData?.finance_accounts}
        warehouseData={warehouseData}
      />
    </Space>
  )
}

export default ProductDetailPage
