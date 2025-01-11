"use client"
import React from "react"
import { Card, Row, Col, Typography, Divider } from "antd"

const { Text, Link } = Typography

const InventoryDetails = () => {
  const data = {
    kategori: "baju",
    deskripsi: "laptopu",
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
    <Card bordered={false} style={{ maxWidth: 600, margin: "0 auto" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row>
            <Text strong>Kategori</Text>
          </Row>
          <Row>
            <Text>{data.kategori}</Text>
          </Row>
          <Divider className="mt-1 mb-5" />
          <Row>
            <Text strong>Deskripsi</Text>
          </Row>
          <Row>
            <Text>{data.deskripsi}</Text>
          </Row>
          <Divider className="mt-1 mb-5" />
          <Row>
            <Col span={24}>
              <Row>
                <Text strong>Gudang</Text>
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
          <Text strong>Pembelian</Text>
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
        {/* <Divider className="mt-1 mb-5" /> */}
        <Col span={24}>
          <Text strong>Penjualan</Text>
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
        {/* <Divider className="mt-1 mb-5" /> */}
        <Col span={24}>
          <Text strong>Inventori</Text>
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
        {/* <Divider className="mt-1 mb-5" /> */}
        <Col span={24}>
          <Text strong>Satuan</Text>
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
        {/* <Divider className="mt-1 mb-5" /> */}
      </Row>
    </Card>
  )
}

export default InventoryDetails
