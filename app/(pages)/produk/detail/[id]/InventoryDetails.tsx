"use client"
import React from "react"
import { Card, Row, Col, Typography, Divider, Button } from "antd"

const { Text, Link, Title } = Typography

const InventoryDetails = () => {
  const data = {
    kategori: "baju",
    deskripsi: "laptop",
    gudang: {
      name: "PUSAT",
      quantity: 89,
    },
    pembelian: {
      harga: "Rp 5.100.000",
      akun: "5-50000 Beban Pokok Pendapatan",
    },
    penjualan: {
      harga: "Rp 7.500.000",
      akun: "4-40000 Pendapatan",
    },
    inventori: {
      akun: "1-10200 Persediaan Barang",
    },
    satuan: "Pcs",
  }

  return (
    <Card className="border-0" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row>
            <Title level={4} strong>
              Kategori
            </Title>
          </Row>
          <Row>
            <Text>{data.kategori}</Text>
          </Row>
          <Divider className="mt-1 mb-5" />
          <Row>
            <Title level={4} strong>
              Deskripsi
            </Title>
          </Row>
          <Row>
            <Text>{data.deskripsi}</Text>
          </Row>
          <Divider className="mt-1 mb-5" />
          <Row>
            <Col span={24}>
              <Row>
                <Title level={4} strong>
                  Gudang
                </Title>
              </Row>
              <Row>
                <Col span={8}>
                  <Text>{data.gudang.name}</Text>
                </Col>
                <Col span={16}>
                  <Text>: {data.gudang.quantity} Pcs</Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
        </Col>
        <Col span={24}>
          <Title level={4} strong>
            Pembelian
          </Title>
          <Row>
            <Col span={8}>
              <Text>Harga</Text>
            </Col>
            <Col span={16}>
              <Text>: {data.pembelian.harga}</Text>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
          <Row>
            <Col span={8}>
              <Text>Akun</Text>
            </Col>
            <Col span={16}>
              <Text>
                : <Link>{data.pembelian.akun}</Link>
              </Text>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
        </Col>
        <Col span={24}>
          <Title level={4} strong>
            Penjualan
          </Title>
          <Row>
            <Col span={8}>
              <Text>Harga</Text>
            </Col>
            <Col span={16}>
              <Text>: {data.penjualan.harga}</Text>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
          <Row>
            <Col span={8}>
              <Text>Akun</Text>
            </Col>
            <Col span={16}>
              <Text>
                : <Link>{data.penjualan.akun}</Link>
              </Text>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
        </Col>
        <Col span={24}>
          <Title level={4} strong>
            Inventori
          </Title>
          <Row>
            <Col span={8}>
              <Text>Akun Aset Inventori</Text>
            </Col>
            <Col span={16}>
              <Text>
                : <Link>{data.inventori.akun}</Link>
              </Text>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
        </Col>
        <Col span={24}>
          <Title level={4} strong>
            Satuan
          </Title>
          <Row>
            <Col span={8}>
              <Text>Satuan Dasar</Text>
            </Col>
            <Col span={16}>
              <Text>: {data.satuan}</Text>
            </Col>
          </Row>
          <Divider className="mt-1 mb-5" />
        </Col>
        <Button type="primary" icon="+">
          Tambah konversi satuan
        </Button>
      </Row>
    </Card>
  )
}

export default InventoryDetails
