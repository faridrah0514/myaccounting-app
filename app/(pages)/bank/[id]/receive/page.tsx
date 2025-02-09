// Import necessary modules and components
"use client"
import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, message, DatePicker, Switch, Row, Col, Table, Upload } from "antd"
import { PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import TambahKontakDrawer from "@/app/components/Contact/TambahKontakDrawer"
import TambahAkunDrawer from "@/app/components/Account/TambahAkunDrawer"
import getColumns from "./columns"
import type { ContactType, FinanceAccountType } from "@/app/types/types"
import { numberToCurrency } from "@/app/utils/utils"
const { Option } = Select

const KasTerimaDana: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isAkunDrawerVisible, setIsAkunDrawerVisible] = useState(false)
  const [akunData, setAkunData] = useState<any[]>([])
  const [allAccounts, setAllAccounts] = useState<FinanceAccountType[]>([])
  const [contacts, setContacts] = useState<ContactType[]>([])
  const [form] = Form.useForm()
  const router = useRouter()

  const getAllAccounts = async () => {
    const response = await fetch("/api/accounts")
    const data = await response.json()
    const accounts = data.finance_accounts
    setAllAccounts(accounts)
  }

  const getContacts = async () => {
    const response = await fetch("/api/contacts")
    const data = await response.json()
    const contacts = data.contacts
    setContacts(contacts)
  }

  useEffect(() => {
    getAllAccounts()
    getContacts()
    setAkunData([{ key: Date.now(), account_id: "", description: "", tax: "", total: 0 }])
  }, [])

  const showAkunDrawer = () => setIsAkunDrawerVisible(true)
  const handleAkunDrawerClose = () => setIsAkunDrawerVisible(false)
  const handleAkunDrawerSubmit = () => {
    message.success("Akun berhasil ditambahkan")
    setIsAkunDrawerVisible(false)
  }

  const showDrawer = () => setIsDrawerVisible(true)
  const handleDrawerClose = () => setIsDrawerVisible(false)
  const handleDrawerSubmit = (data: ContactType[]) => {
    setContacts(data)
    message.success("Kontak berhasil ditambahkan")
    setIsDrawerVisible(false)
  }
  const addTableRow = () => {
    setAkunData([...akunData, { key: Date.now(), account_id: "", description: "", tax: "", total: 0 }])
  }

  const removeTableRow = (key: number) => {
    setAkunData(akunData.filter((item) => item.key !== key))
  }

  const onFieldChange = (key: number, field: string, value: any) => {
    const updatedData = akunData.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    setAkunData(updatedData)
  }

  const columns = getColumns({
    onFieldChange,
    removeTableRow,
    showAkunDrawer,
    accountData: allAccounts,
  })

  const calculateSubTotal = () => {
    return akunData.reduce((sum, row) => sum + (Number(row.total) || 0), 0)
  }

  const calculateTax = () => {
    return akunData.reduce((sum, row) => {
      const total = Number(row.total) || 0
      const taxPercentage = Number(row.pajak) || 0
      return sum + (total * taxPercentage) / 100
    }, 0)
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      // Log the table data
      console.log("Table Data:", akunData)
      console.log("Form Values:", values)

      const response = await fetch("/api/kas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, transaction_details: akunData }),
      })

      if (!response.ok) {
        throw new Error("Failed to add kas data")
      }

      message.success("Data kas berhasil ditambahkan!")
      router.push("/kas")
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title={
        <Row justify="space-between" align="middle">
          <Col>Terima Dana</Col>
          <Col>
            <Button
              type="primary"
              style={{ backgroundColor: "#FFA500", borderColor: "#FFA500" }}
              onClick={() => router.back()}
            >
              Kembali
            </Button>
          </Col>
        </Row>
      }
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={{ hargaTermasukPajak: false }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Dari" name="contact_id" rules={[{ required: true, message: "Pilih kontak" }]}>
              <Select
                placeholder="Pilih kontak"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <div style={{ padding: "8px", cursor: "pointer", color: "#1890ff" }} onClick={showDrawer}>
                      + Tambah Kontak
                    </div>
                  </div>
                )}
              >
                {contacts.map((contact) => (
                  <Option key={contact.id} value={contact.id}>
                    {contact.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nomor" name="tx_id" rules={[{ required: true, message: "Nomor diperlukan" }]}>
              <Input placeholder="BANK/00072" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              initialValue={dayjs()}
              label="Tanggal Transaksi"
              name="transaction_date"
              rules={[{ required: true, message: "Pilih tanggal transaksi" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Referensi" name="reference">
              <Input placeholder="Referensi" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Tag" name="tag">
              <Select placeholder="Pilih Tag" disabled>
                <Option value="tag1">Tag 1</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tag" name="tag">
              <Select placeholder="Pilih Tag">
                <Option value="tag1">Tag 1</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row> */}

        <Table
          dataSource={akunData}
          className="mb-10 mt-5"
          columns={columns}
          pagination={false}
          rowKey="key"
          footer={() => (
            <Button type="dashed" onClick={addTableRow} block icon={<PlusOutlined />}>
              Tambah Baris
            </Button>
          )}
        />

        <Row gutter={16} align="stretch">
          <Col span={12}>
            {/* <Form.Item label="Attachment" name="attachment">
              <Upload beforeUpload={() => false} maxCount={1} disabled>
                <Button icon={<UploadOutlined />} disabled>
                  Klik atau seret file ke sini
                </Button>
              </Upload>
              <small>File size maksimal 10 MB</small>
            </Form.Item> */}
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <div>
              <div style={{ marginBottom: "8px" }}>Sub Total: {numberToCurrency(calculateSubTotal())}</div>
              <div style={{ marginBottom: "8px" }}>Pajak: {numberToCurrency(calculateTax())}</div>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Total: {numberToCurrency(calculateSubTotal() + calculateTax())}
              </div>
            </div>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
              Simpan
            </Button>
          </Col>
        </Row>
      </Form>

      <TambahKontakDrawer visible={isDrawerVisible} onClose={handleDrawerClose} onSubmit={handleDrawerSubmit} />

      <TambahAkunDrawer
        visible={isAkunDrawerVisible}
        onClose={handleAkunDrawerClose}
        onSubmit={handleAkunDrawerSubmit}
      />
    </Card>
  )
}

export default KasTerimaDana
