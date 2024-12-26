"use client"
import React, { useEffect, useState } from "react"
import { Drawer, Form, Input, Select, Button, Row, Col, message } from "antd"
import type { DefaultOptionType } from "antd/es/select"
import type { ContactType } from "@/app/types/types"

import { z } from "zod"

const { Option } = Select

interface TambahKontakDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: ContactType[]) => void
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

  const handleSubmit = (values: ContactType) => {
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data: { contacts: ContactType[] }) => {
        message.success("Contact submitted successfully")
        onSubmit(data.contacts)
      })
      .catch((error) => {
        message.error(`Failed to submit contact: ${error.message}`)
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
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tipe Kontak" name="contact_type" rules={[{ required: true }]}>
          <Select placeholder="Pilih tipe kontak">
            <Option value="Personal">Personal</Option>
            <Option value="Perusahaan">Perusahaan</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Nama" name="name" rules={[{ required: true }]}>
          <Input placeholder="Masukkan nama" />
        </Form.Item>
        <Form.Item
          label="Telepon"
          name="phone"
          rules={[
            { required: true, message: "Telepon harus diisi" },
            { pattern: /^[0-9]*$/, message: "Hanya angka yang diperbolehkan" },
            { min: 4, message: "Min 4 karakter" },
          ]}
        >
          <Input placeholder="Telepon" />
        </Form.Item>
        <Form.Item label="Alamat" name="address" rules={[{ required: true }]}>
          <Input placeholder="Alamat" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Provinsi" name="province_id" rules={[{ required: true }]}>
              <Select placeholder="Pilih provinsi" options={province} onChange={(value: string) => fetchCity(value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kota" name="city_id" rules={[{ required: true }]}>
              <Select placeholder="Pilih kota" options={city} onChange={(value: string) => fetchDistrict(value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Kecamatan" name="district_id" rules={[{ required: true }]}>
              <Select
                placeholder="Pilih kecamatan"
                options={district}
                onChange={(value: string) => fetchVillage(value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kelurahan" name="village_id" rules={[{ required: true }]}>
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
          <Button htmlType="submit" type="primary">
            Tambah
          </Button>
        </Row>
      </Form>
    </Drawer>
  )
}

export default TambahKontakDrawer
