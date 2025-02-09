// Import necessary modules and components
"use client"
import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, message, DatePicker, Switch, Row, Col, Table } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import TambahKontakDrawer from "@/app/components/Contact/TambahKontakDrawer"
import TambahAkunDrawer from "@/app/components/Account/TambahAkunDrawer"
import { flattenAccounts } from "@/app/utils/utils"
import getColumns from "./columns"
const { Option } = Select

const BiayaTambah: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isAkunDrawerVisible, setIsAkunDrawerVisible] = useState(false)
  const [akunBiayaData, setAkunBiayaData] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const router = useRouter()

  const getAccounts = async () => {
    const response = await fetch("/api/accounts")
    const data = await response.json()
    const accounts = data.finance_accounts
      .flatMap((account: any) => flattenAccounts([account]))
      .filter((account: any) => account.category.name === "Kas & Bank")
    setAccounts(accounts)
  }

  useEffect(() => {
    getAccounts()
    // Add an initial empty row when the component mounts
    setAkunBiayaData([{ key: Date.now(), akun: "", deskripsi: "", pajak: "", total: 0 }])
  }, [])

  const showAkunDrawer = () => setIsAkunDrawerVisible(true)
  const handleAkunDrawerClose = () => setIsAkunDrawerVisible(false)
  const handleAkunDrawerSubmit = () => {
    message.success("Akun berhasil ditambahkan")
    setIsAkunDrawerVisible(false)
  }

  const showDrawer = () => setIsDrawerVisible(true)
  const handleDrawerClose = () => setIsDrawerVisible(false)
  const handleDrawerSubmit = () => {
    message.success("Kontak berhasil ditambahkan")
    setIsDrawerVisible(false)
  }
  const addTableRow = () => {
    setAkunBiayaData([...akunBiayaData, { key: Date.now(), akun: "", deskripsi: "", pajak: "", total: 0 }])
  }

  const removeTableRow = (key: number) => {
    setAkunBiayaData(akunBiayaData.filter((item) => item.key !== key))
  }

  const onFieldChange = (key: number, field: string, value: any) => {
    const updatedData = akunBiayaData.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    setAkunBiayaData(updatedData)
  }

  const columns = getColumns({
    onFieldChange,
    removeTableRow,
    showAkunDrawer,
  })

  // Form submission handler
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch("/api/biaya", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, akunBiaya: akunBiayaData }),
      })

      if (!response.ok) {
        throw new Error("Failed to add biaya")
      }

      message.success("Biaya berhasil ditambahkan!")
      router.push("/Biaya")
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
          <Col>Tambah Biaya</Col>
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
      <Form layout="vertical" onFinish={onFinish} initialValues={{ bayarNanti: false }}>
        {/* Row 1 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Dibayar Dari"
              name="dibayarDari"
              rules={[{ required: true, message: "Pilih sumber pembayaran" }]}
            >
              <Select
                placeholder="Pilih sumber"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <div style={{ padding: "8px", cursor: "pointer", color: "#1890ff" }} onClick={showAkunDrawer}>
                      + Tambah Akun
                    </div>
                  </div>
                )}
              >
                {accounts.map((account) => (
                  <Option key={account.id} value={account.id}>
                    {account.ref_code} - {account.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Bayar Nanti" name="bayarNanti" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Penerima" name="penerima" rules={[{ required: true, message: "Pilih penerima" }]}>
              <Select
                placeholder="Pilih penerima"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <div style={{ padding: "8px", cursor: "pointer", color: "#1890ff" }} onClick={showDrawer}>
                      + Tambah kontak
                    </div>
                  </div>
                )}
              >
                <Option value="Agnes Riyanti Nababan - PT Padmasari Pratiwi Tbk">
                  Agnes Riyanti Nababan - PT Padmasari Pratiwi Tbk
                </Option>
                <Option value="Agus Danuja Utama S.Farm Widodo - Yayasan Yolanda Pangestu">
                  Agus Danuja Utama S.Farm Widodo - Yayasan Yolanda Pangestu
                </Option>
                <Option value="Aisyah Hamima Purnawati M.Kom. Mangunsong - Fa NurDIYanti Namaga">
                  Aisyah Hamima Purnawati M.Kom. Mangunsong - Fa NurDIYanti Namaga
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tgl Transaksi"
              name="tglTransaksi"
              rules={[{ required: true, message: "Pilih tanggal transaksi" }]}
            >
              <DatePicker style={{ width: "100%" }} defaultValue={dayjs()} />
            </Form.Item>
          </Col>
        </Row>

        {/* Nomor and Tag */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Nomor" name="nomor">
              <Input placeholder="EXP/00042" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tag" name="tag">
              <Select placeholder="Pilih Tag" className="rounded-xl">
                <Option value="Tag 1">Tag 1</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Table for Akun Biaya */}
        <Table
          dataSource={akunBiayaData}
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
        {/* Pesan and Totals */}
        <Row gutter={16} align="stretch" style={{ marginTop: 16 }}>
          <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
            <Form.Item label="Pesan" name="pesan" style={{ flex: 1 }}>
              <Input.TextArea rows={3} placeholder="Pesan" style={{ height: "100%" }} />
            </Form.Item>
            {/* Attachment */}
            {/* <Form.Item label="Attachment" name="attachment" style={{ marginBottom: "0" }}>
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Klik atau seret file ke sini</Button>
              </Upload>
              <small>File size maximal 10 MB</small>
            </Form.Item> */}
          </Col>
          <Col
            span={12}
            style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: "10px",
            }}
          >
            <div>
              <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Sub Total: 0</div>
              <div style={{ marginBottom: "16px", fontWeight: "bold" }}>Total: 0</div>
            </div>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
              Simpan
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Tambah Kontak Drawer */}
      <TambahKontakDrawer visible={isDrawerVisible} onClose={handleDrawerClose} onSubmit={handleDrawerSubmit} />

      {/* Tambah Akun Drawer */}
      <TambahAkunDrawer
        visible={isAkunDrawerVisible}
        onClose={handleAkunDrawerClose}
        onSubmit={handleAkunDrawerSubmit}
      />
    </Card>
  )
}

export default BiayaTambah
