"use client"

import React, { useState } from "react"
import { Card, Form, Input, Button, Select, Switch, InputNumber, Typography, Row, Col } from "antd"
import { useRouter } from "next/navigation"

const { Option } = Select
const { Title, Text } = Typography

const TambahProduk: React.FC = () => {
  const [isBuyable, setIsBuyable] = useState<boolean>(true)
  const [isSellable, setIsSellable] = useState<boolean>(true)
  const [isTrackable, setIsTrackable] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values)
  }

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
      <Form layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<Text strong>Kategori</Text>}
              name="kategori"
              rules={[{ required: true, message: "Kategori harus diisi" }]}
            >
              <Select placeholder="Pilih Kategori">
                <Option value="kategori1">Kategori 1</Option>
                <Option value="kategori2">Kategori 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<Text strong>Satuan</Text>}
              name="satuan"
              rules={[{ required: true, message: "Satuan harus diisi" }]}
            >
              <Select placeholder="Pilih Satuan">
                <Option value="pcs">Pcs</Option>
                <Option value="kg">Kg</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<Text strong>Nama Produk</Text>}
              name="namaProduk"
              rules={[{ required: true, message: "Nama Produk harus diisi" }]}
            >
              <Input placeholder="Nama Produk" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<Text strong>Kode/SKU</Text>} name="sku">
              <Input placeholder="SKU/00000" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={<Text strong>Deskripsi</Text>} name="deskripsi">
          <Input.TextArea placeholder="Deskripsi" rows={3} />
        </Form.Item>

        <Form.Item>
          <Switch checked={isBuyable} onChange={setIsBuyable} /> Saya membeli item ini
        </Form.Item>

        {isBuyable && (
          <Form.Item label={<Text strong>Harga</Text>} name="hargaBeli">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Harga" />
          </Form.Item>
        )}

        <Form.Item>
          <Switch checked={isSellable} onChange={setIsSellable} /> Saya menjual item ini
        </Form.Item>

        {isSellable && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<Text strong>Harga</Text>} name="hargaJual">
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

        <Form.Item>
          <Switch checked={isTrackable} onChange={setIsTrackable} /> Saya melacak inventori item ini
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default TambahProduk
