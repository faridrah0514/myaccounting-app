"use client"

import React, { useState, useEffect } from "react"
import { Card, Form, Input, Button, Select, Switch, Typography, Row, Col, message, Radio } from "antd"
import { useRouter } from "next/navigation"
import AddProductCategoryDrawer from "@/app/components/Product/AddProductCategoryDrawer"
import type { ProductCategoryType, ProductUnitType, ProductType } from "@/app/types/types"
import AddProductUnitDrawer from "@/app/components/Product/AddProductUnitDrawer"

const { Option } = Select
const { Title, Text } = Typography

const currencyFormatter = (value: string | undefined): string => {
  if (value) {
    const numericValue = value.replace(/[^\d]/g, "")
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(numericValue))
  }
  return ""
}

const numericOnly = (value: number | string | undefined): number => {
  if (typeof value === "number") {
    return value
  }
  return value ? parseFloat(value.replace(/[^\d]/g, "")) || 0 : 0
}

const TambahProduk: React.FC = () => {
  const [isPurchase, setIsPurchase] = useState<boolean>(true)
  const [isSell, setIsSell] = useState<boolean>(true)
  const [isTrackInventory, setIsTrackInventory] = useState<boolean>(false)
  const [isManualQty, setIsManualQty] = useState<boolean>(false)
  const [productDrawerVisible, setProductDrawerVisible] = useState<boolean>(false)
  const [unitDrawerVisible, setUnitDrawerVisible] = useState<boolean>(false)
  const [unitData, setUnitData] = useState<ProductUnitType[]>([])
  const [categoryData, setCategoryData] = useState<ProductCategoryType[]>([])
  const [form] = Form.useForm()
  const router = useRouter()

  const handleSubmit = (values: ProductType) => {
    values.is_purchase = isPurchase
    values.is_sell = isSell

    values.manual_qty = values.qty_type == "manual_qty" ? form.getFieldValue("manual_qty") : 0
    const sanitizedValues = {
      ...values,
      purchase_price: values.purchase_price ? numericOnly(values.purchase_price) : null,
      sell_price: values.sell_price ? numericOnly(values.sell_price) : null,
    }

    fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedValues),
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="is_purchase" valuePropName="checked">
              <Switch
                className="mr-2"
                checked={isPurchase}
                onChange={() => {
                  setIsPurchase(!isPurchase)
                }}
              />
              Saya membeli item ini
            </Form.Item>

            <Form.Item label={<Text strong>Harga</Text>} name="purchase_price">
              <Input
                disabled={!isPurchase}
                placeholder="Harga"
                onChange={(e) => {
                  const sanitizedValue = numericOnly(e.target.value)
                  form.setFieldsValue({
                    purchase_price: currencyFormatter(sanitizedValue.toString()),
                  })
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item valuePropName="checked" name="is_sell">
              <Switch
                className="mr-2"
                checked={isSell}
                onChange={() => {
                  setIsSell(!isSell)
                }}
              />
              Saya menjual item ini
            </Form.Item>

            <Form.Item label={<Text strong>Harga</Text>} name="sell_price">
              <Input
                disabled={!isSell}
                placeholder="Harga"
                onChange={(e) => {
                  const sanitizedValue = numericOnly(e.target.value)
                  form.setFieldsValue({
                    sell_price: currencyFormatter(sanitizedValue.toString()),
                  })
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="track_inventory" valuePropName="checked">
              <Switch
                checked={isTrackInventory}
                onChange={() => {
                  setIsTrackInventory(!isTrackInventory)
                }}
              />
              Saya melacak inventori item ini
            </Form.Item>

            <Form.Item label={<Text strong>Stok minimal</Text>} name="qty_type">
              <Radio.Group
                disabled={!isTrackInventory}
                onChange={(e) => (e.target.value === "manual_qty" ? setIsManualQty(true) : setIsManualQty(false))}
              >
                <Radio value="business_flow_qty" style={{ marginRight: 10, marginBottom: 10 }}>
                  Sesuai pengaturan alur bisnis
                </Radio>
                <Radio value="manual_qty">
                  <Input
                    placeholder="Masukkan jumlah qty"
                    disabled={!isManualQty}
                    onChange={(e) => {
                      form.setFieldValue("manual_qty", e.target.value)
                    }}
                  />
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

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
