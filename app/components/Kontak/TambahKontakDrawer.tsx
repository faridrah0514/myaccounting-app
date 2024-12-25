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
            <Option value="personal">Personal</Option>
            <Option value="perusahaan">Perusahaan</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Nama" name="nama" rules={[{ required: true }]}>
          <Input placeholder="Masukkan nama" />
        </Form.Item>
        <Form.Item label="Telepon sekunder" name="teleponSekunder">
          <Input placeholder="Telepon sekunder" />
        </Form.Item>
        <Form.Item label="Fax" name="fax">
          <Input placeholder="Fax" />
        </Form.Item>
        <Form.Item label="Alamat Penagihan" name="alamatPenagihan">
          <Input placeholder="Alamat Penagihan" />
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
            <Form.Item label="Tipe Kartu Identitas" name="tipeKartuIdentitas">
              <Select placeholder="Silahkan pilih tipe kartu identitas">
                <Option value="KTP">KTP</Option>
                <Option value="SIM">SIM</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ID Kartu Identitas" name="idKartuIdentitas">
              <Input placeholder="ID Kartu Identitas" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="NPWP" name="npwp">
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
