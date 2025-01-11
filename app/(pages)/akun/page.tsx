"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  Button,
  Dropdown,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Input,
  Menu,
  Drawer,
  Form,
  Select,
  message,
} from "antd"
import {
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  PrinterOutlined,
  ImportOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { FinanceAccountType, FinanceAccountCategoryType } from "@/app/types/types"

const { Title } = Typography
const { Option } = Select

const columns: ColumnsType<FinanceAccountType> = [
  {
    title: "Kode",
    dataIndex: "ref_code",
    key: "ref_code",
    sorter: true,
  },
  {
    title: "Nama",
    dataIndex: "name",
    key: "name",
    sorter: true,
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Kategori",
    dataIndex: ["category", "name"],
    key: "category.name",
    sorter: true,
  },
  {
    title: "Saldo",
    dataIndex: "balance",
    key: "balance",
    sorter: true,
    render: (text: number) => `Rp ${text.toLocaleString("id-ID")}`,
  },
]

const reportMenu = (
  <Menu>
    <Menu.Item key="1">Buku Besar</Menu.Item>
  </Menu>
)

const AkunPage: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [accountData, setAccountData] = useState<{
    finance_accounts: FinanceAccountType[]
    finance_account_categories: FinanceAccountCategoryType[]
  }>()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [form] = Form.useForm()

  const showDrawer = () => {
    setDrawerVisible(true)
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
  }

  const fetchData = async () => {
    try {
      const response = await fetch("/api/accounts")
      const data = await response.json()
      setAccountData({
        finance_accounts: data.finance_accounts.map((account: FinanceAccountType, index: number) => ({
          ...account,
          key: index,
        })),
        finance_account_categories: data.finance_account_categories.map(
          (category: FinanceAccountCategoryType, index: number) => ({
            ...category,
            key: index,
          })
        ),
      })
    } catch (error) {
      message.error("Gagal mengambil data akun: " + (error as Error).message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFormSubmit = (values: FinanceAccountType) => {
    console.log("values --> ", values)
    fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((result: { finance_accounts: FinanceAccountType[] }) => {
        message.success("Akun berhasil ditambahkan")
        setAccountData({
          finance_accounts: result.finance_accounts.map((account: FinanceAccountType, index: number) => ({
            ...account,
            key: index,
          })),
          finance_account_categories: accountData?.finance_account_categories || [],
        })
      })
      .catch((error) => {
        message.error(`Terjadi kesalahan saat menambahkan akun: ${error.message}`)
      })
      .finally(() => {
        closeDrawer()
        form.resetFields()
      })
  }
  const onFinish = (values: FinanceAccountType) => {
    handleFormSubmit(values)
  }
  const flattenAccounts = (accounts: FinanceAccountType[]) => {
    const result: FinanceAccountType[] = []

    accounts.forEach((account) => {
      result.push(account) // Add the current account
      if (account.children && account.children.length > 0) {
        result.push(...flattenAccounts(account.children)) // Recursively add children
      }
    })

    return result
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
      <Table columns={columns} dataSource={accountData?.finance_accounts} pagination={{ pageSize: 50 }} />

      <Drawer title="Tambah Akun" placement="right" onClose={closeDrawer} visible={drawerVisible} width={400}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item label="Nama" name="name" rules={[{ required: true, message: "Nama wajib diisi" }]}>
            <Input placeholder="Nama" />
          </Form.Item>
          <Form.Item label="Kode" name="ref_code" rules={[{ required: true, message: "Kode wajib diisi" }]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item
            label="Kategori"
            name="finance_account_category_id"
            rules={[{ required: true, message: "Kategori wajib diisi" }]}
          >
            <Select placeholder="Pilih kategori" onChange={(value) => setSelectedCategory(value)}>
              {accountData?.finance_account_categories.map((category, key) => (
                <Option key={key} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Sub Akun dari" name="parent_id">
            <Select placeholder="Pilih akun" allowClear>
              {accountData?.finance_accounts
                .filter((account) => {
                  return account.finance_account_category_id === selectedCategory
                })
                .flatMap((account) => flattenAccounts([account]))
                .map((account, key) => (
                  <Option key={key} value={account.id}>
                    {account.ref_code} - {account.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Row justify="end">
            <Space>
              <Button onClick={closeDrawer}>Batal</Button>
              <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
                Tambah
              </Button>
            </Space>
          </Row>
        </Form>
      </Drawer>
    </Card>
  )
}

export default AkunPage
