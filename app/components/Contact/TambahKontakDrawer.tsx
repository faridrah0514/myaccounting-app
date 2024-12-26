"use client"
import React, { useEffect, useState } from "react"
import { Drawer, Form, Input, Select, Button, Row, Col } from "antd"
import type { DefaultOptionType } from "antd/es/select"

import { z } from "zod"

const { Option } = Select

interface TambahKontakDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: () => void
}
const RegionSchema = z.object({
  code: z.string(),
  name: z.string(),
})

const RegionResponseSchema = z.object({
  region: z.array(RegionSchema),
})

type RegionType = z.infer<typeof RegionSchema>
type RegionResponseType = z.infer<typeof RegionResponseSchema>

const TambahKontakDrawer: React.FC<TambahKontakDrawerProps> = ({ visible, onClose, onSubmit }) => {
  const [province, setProvince] = useState<DefaultOptionType[]>([])
  const [city, setCity] = useState<DefaultOptionType[]>([])
  const [district, setDistrict] = useState<DefaultOptionType[]>([])
  const [village, setVillage] = useState<DefaultOptionType[]>([])

  const handleSubmit = (values: any) => {
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data)
        onSubmit()
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  const fetchCity = (provinceCode: string) => {
    fetch(`/api/region?province=${provinceCode}`)
      .then((res) => res.json())
      .then((data: RegionResponseType) => {
        if (RegionResponseSchema.parse(data)) {
          setCity(data.region.map((item: RegionType) => ({ label: item.name, value: item.code })))
        }
      })
  }

  const fetchDistrict = (cityCode: string) => {
    fetch(`/api/region?city=${cityCode}`)
      .then((res) => res.json())
      .then((data: RegionResponseType) => {
        if (RegionResponseSchema.parse(data)) {
          setDistrict(data.region.map((item: RegionType) => ({ label: item.name, value: item.code })))
        }
      })
  }

  const fetchVillage = (districtCode: string) => {
    fetch(`/api/region?district=${districtCode}`)
      .then((res) => res.json())
      .then((data: RegionResponseType) => {
        if (RegionResponseSchema.parse(data)) {
          setVillage(data.region.map((item: RegionType) => ({ label: item.name, value: item.code })))
        }
      })
  }

  useEffect(() => {
    fetch("/api/region")
      .then((res) => res.json())
      .then((data: RegionResponseType) => {
        if (RegionResponseSchema.parse(data)) {
          setProvince(data.region.map((item: RegionType) => ({ label: item.name, value: item.code })))
        }
      })
  }, [])

  return (
    <Drawer title="Tambah Kontak" placement="right" visible={visible} onClose={onClose} width={480}>
      <Form layout="vertical">
        <Form.Item label="Tipe Kontak" name="tipeKontak" rules={[{ required: true }]}>
          <Select placeholder="Pilih tipe kontak">
            <Option value="Personal">Personal</Option>
            <Option value="Perusahaan">Perusahaan</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Nama" name="name" rules={[{ required: true }]}>
          <Input placeholder="Masukkan nama" />
        </Form.Item>
        <Form.Item label="Telepon" name="phone">
          <Input placeholder="Telepon" />
        </Form.Item>
        <Form.Item label="Alamat" name="address">
          <Input placeholder="Alamat" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Provinsi" name="province">
              <Select placeholder="Pilih provinsi" options={province} onChange={(value: string) => fetchCity(value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kota" name="city">
              <Select placeholder="Pilih kota" options={city} onChange={(value: string) => fetchDistrict(value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Kecamatan" name="district">
              <Select
                placeholder="Pilih kecamatan"
                options={district}
                onChange={(value: string) => fetchVillage(value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kelurahan" name="village">
              <Select placeholder="Pilih kelurahan" options={village} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tipe Kartu Identitas" name="id_type">
              <Select placeholder="Silahkan pilih tipe kartu identitas">
                <Option value="KTP">KTP</Option>
                <Option value="SIM">SIM</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ID Kartu Identitas" name="id_number">
              <Input placeholder="ID Kartu Identitas" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="NPWP" name="tax_number">
          <Input placeholder="NPWP" />
        </Form.Item>
        <Row justify="end">
          <Button type="primary" onClick={onSubmit}>
            Tambah
          </Button>
        </Row>
      </Form>
    </Drawer>
  )
}

export default TambahKontakDrawer
