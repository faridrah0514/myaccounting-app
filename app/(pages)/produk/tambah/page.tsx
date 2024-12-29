"use client"

import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, Switch, InputNumber, Typography, Row, Col, message } from "antd"
import { useRouter } from "next/navigation"
import AddProductCategoryDrawer from "@/app/components/Product/AddProductCategoryDrawer"
import type { ProductCategoryType, ProductUnitType } from "@/app/types/types"
import AddProductUnitDrawer from "@/app/components/Product/AddProductUnitDrawer"

const { Option } = Select
const { Title, Text } = Typography

const TambahProduk: React.FC = () => {
  const [isPurchase, setIsPurchase] = useState<boolean>(true)
  const [isSell, setIsSell] = useState<boolean>(true)
  // const [isTrackable, setIsTrackable] = useState<boolean>(false)
  const [productDrawerVisible, setProductDrawerVisible] = useState<boolean>(false)
  const [unitDrawerVisible, setUnitDrawerVisible] = useState<boolean>(false)
  const [unitData, setUnitData] = useState<ProductUnitType[]>([])
  const [categoryData, setCategoryData] = useState<ProductCategoryType[]>([])
  const [form] = Form.useForm()
  const router = useRouter()

  const handleSubmit = (values: any) => {
    fetch("/api/product", {
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
      .then(() => {
        message.success("Product added successfully")
        router.push("/produk")
      })
      .catch((error) => {
        message.error("Failed to add product: " + error.message)
      })
      .finally(() => form.resetFields())
  }

  const showProductCategoryDrawer = () => setProductDrawerVisible(true)
  const closeProductCategoryDrawer = () => setProductDrawerVisible(false)
  const showProductUnitDrawer = () => setUnitDrawerVisible(true)
  const closeProductUnitDrawer = () => setUnitDrawerVisible(false)

  useEffect(() => {
    const fetchCategoryData = () => {
      fetch("/api/product")
        .then((response) => response.json())
        .then((data: { categories: ProductCategoryType[]; units: ProductUnitType[] }) => {
          setCategoryData(data.categories)
          setUnitData(data.units)
        })
        .catch((error) => message.error("Failed to fetch category data:", error))
    }

    fetchCategoryData()
  }, [])

  return (
    <Card
      title={
        <>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ marginBottom: "0px" }}>
                Tambah Produk
              </Title>
            </Col>
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
        </>
      }
    >
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<Text strong>Kategori</Text>}
              name="product_category_id"
              rules={[{ required: true, message: "Kategori harus diisi" }]}
            >
              <Select
                placeholder="Pilih Kategori"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <div
                      style={{ padding: "8px", cursor: "pointer", color: "#1890ff" }}
                      onClick={showProductCategoryDrawer}
                    >
                      + Tambah Kategori
                    </div>
                  </div>
                )}
              >
                {categoryData.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<Text strong>Satuan</Text>}
              name="product_unit_id"
              rules={[{ required: true, message: "Satuan harus diisi" }]}
            >
              <Select
                placeholder="Pilih Satuan"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <div
                      style={{ padding: "8px", cursor: "pointer", color: "#1890ff" }}
                      onClick={showProductUnitDrawer}
                    >
                      + Tambah Satuan
                    </div>
                  </div>
                )}
              >
                {unitData.map((unit) => (
                  <Option key={unit.id} value={unit.id}>
                    {unit.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<Text strong>Nama Produk</Text>}
              name="name"
              rules={[{ required: true, message: "Nama Produk harus diisi" }]}
            >
              <Input placeholder="Nama Produk" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<Text strong>Kode/SKU</Text>} name="code">
              <Input placeholder="SKU/00000" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={<Text strong>Deskripsi</Text>} name="description">
          <Input.TextArea placeholder="Deskripsi" rows={3} />
        </Form.Item>

        <Form.Item name="is_purchase" valuePropName="checked">
          <Switch checked onChange={setIsPurchase} /> Saya membeli item ini
        </Form.Item>

        {isPurchase && (
          <Form.Item label={<Text strong>Harga</Text>} name="purchase_price">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Harga" />
          </Form.Item>
        )}

        <Form.Item valuePropName="checked" name="is_sell">
          <Switch checked onChange={setIsSell} /> Saya menjual item ini
        </Form.Item>

        {isSell && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text strong>Harga</Text>} name="sell_price">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="Harga" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ cursor: "pointer" }}>
                + Tampilkan Harga Grosir
              </Text>
            </Col>
          </Row>
        )}

        {/* <Form.Item>
          <Switch checked={isTrackable} onChange={setIsTrackable} /> Saya melacak inventori item ini
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Simpan
          </Button>
        </Form.Item>
      </Form>

      <AddProductCategoryDrawer
        visible={productDrawerVisible}
        onClose={closeProductCategoryDrawer}
        onSubmit={(data) => {
          setCategoryData(data)
          closeProductCategoryDrawer()
        }}
      />

      <AddProductUnitDrawer
        visible={unitDrawerVisible}
        onClose={closeProductUnitDrawer}
        onSubmit={(data) => {
          setUnitData(data)
          closeProductUnitDrawer()
        }}
      />
    </Card>
  )
}

export default TambahProduk
