"use client"

import React from "react"
import { Drawer, Form, Input, Button, Space, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import type { ProductUnitType } from "@/app/types/types"
import { useForm } from "antd/es/form/Form"

interface AddProductUnitDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: ProductUnitType[]) => void
}

const AddProductUnitDrawer: React.FC<AddProductUnitDrawerProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = useForm<ProductUnitType>()
  const handleFormSubmit = (values: ProductUnitType) => {
    fetch("/api/products/units", {
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
      .then((result: { units: ProductUnitType[] }) => {
        message.success("Kategori produk berhasil ditambahkan")
        onSubmit(result.units)
      })
      .catch((error) => {
        message.error(`Terjadi kesalahan saat menambahkan kategori produk: ${error.message}`)
      })
      .finally(() => {
        form.resetFields()
      })
  }

  const onFinish = (values: ProductUnitType) => {
    handleFormSubmit(values)
  }

  return (
    <Drawer title="Tambah Kategori Produk" placement="right" visible={visible} onClose={onClose} width={480}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item label="Nama Satuan" name="name" rules={[{ required: true, message: "Nama satuan wajib diisi" }]}>
          <Input placeholder="Nama Satuan" />
        </Form.Item>
        <Space style={{ justifyContent: "space-between" }}>
          <Button onClick={onClose}>Batal</Button>
          <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
            Tambah
          </Button>
        </Space>
      </Form>
    </Drawer>
  )
}

export default AddProductUnitDrawer
