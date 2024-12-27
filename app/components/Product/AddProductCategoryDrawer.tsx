"use client"

import React from "react"
import { Drawer, Form, Input, Button, Space, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import type { ProductCategoryType } from "@/app/types/types"
import { useForm } from "antd/es/form/Form"

interface AddProductCategoryDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: ProductCategoryType[]) => void
}

const AddProductCategoryDrawer: React.FC<AddProductCategoryDrawerProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = useForm<ProductCategoryType>()
  const handleFormSubmit = (values: ProductCategoryType) => {
    fetch("/api/product/category", {
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
      .then((result: { categories: ProductCategoryType[] }) => {
        message.success("Kategori produk berhasil ditambahkan")
        onSubmit(result.categories)
      })
      .catch((error) => {
        message.error(`Terjadi kesalahan saat menambahkan kategori produk: ${error.message}`)
      })
      .finally(() => {
        form.resetFields()
      })
  }

  const onFinish = (values: ProductCategoryType) => {
    handleFormSubmit(values)
  }

  return (
    <Drawer title="Tambah Kategori Produk" placement="right" visible={visible} onClose={onClose} width={480}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item label="Nama Kategori" name="name" rules={[{ required: true, message: "Nama kategori wajib diisi" }]}>
          <Input placeholder="Nama Kategori" />
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

export default AddProductCategoryDrawer
