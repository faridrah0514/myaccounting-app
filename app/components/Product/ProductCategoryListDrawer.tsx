"use client"

import React, { useEffect, useState } from "react"

import { Drawer, Input, Table, Button, Space, message } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import AddProductCategoryDrawer from "./AddProductCategoryDrawer"
import type { ProductCategoryType } from "@/app/types/types"

const { Search } = Input

interface ProductCategoryListDrawerProps {
  visible: boolean
  onClose: () => void
}

const ProductCategoryListDrawer: React.FC<ProductCategoryListDrawerProps> = ({ visible, onClose }) => {
  const [categoryDrawerVisible, setCategoryDrawerVisible] = useState(false)
  const [categoryData, setCategoryData] = useState<ProductCategoryType[]>([])

  useEffect(() => {
    const fetchCategoryData = () => {
      fetch("/api/products/categories")
        .then((response) => response.json())
        .then((data: { categories: ProductCategoryType[] }) => setCategoryData(data.categories))
        .catch((error) => message.error("Failed to fetch category data:", error))
    }

    fetchCategoryData()
  }, [])

  return (
    <Drawer title="Kategori" placement="right" onClose={onClose} visible={visible} width={500}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Search placeholder="Cari" onSearch={(value) => console.log("Search:", value)} style={{ marginBottom: 16 }} />
        <Table
          dataSource={categoryData}
          columns={[{ title: "Nama", dataIndex: "name", key: "name", render: (text) => <a>{text}</a> }]}
          pagination={false}
        />
        <Space style={{ justifyContent: "space-between", marginTop: 16 }}>
          <Button icon={<DeleteOutlined />} danger>
            Hapus
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCategoryDrawerVisible(true)}>
            Tambah
          </Button>
        </Space>
      </Space>
      <AddProductCategoryDrawer
        visible={categoryDrawerVisible}
        onClose={() => setCategoryDrawerVisible(false)}
        onSubmit={(data) => {
          setCategoryData(data)
          setCategoryDrawerVisible(false)
        }}
      />
    </Drawer>
  )
}

export default ProductCategoryListDrawer
