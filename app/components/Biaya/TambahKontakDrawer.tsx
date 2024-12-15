"use client"
import React from "react"
import { Drawer, Form, Input, Select, Button, Row, Col } from "antd"

const { Option } = Select

interface TambahKontakDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: () => void
}

const TambahKontakDrawer: React.FC<TambahKontakDrawerProps> = ({ visible, onClose, onSubmit }) => {
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
            <Form.Item label="Provinsi" name="provinsi">
              <Input placeholder="Provinsi" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kota" name="kota">
              <Input placeholder="Kota" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Kecamatan" name="kecamatan">
              <Input placeholder="Kecamatan" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kelurahan" name="kelurahan">
              <Input placeholder="Kelurahan" />
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
