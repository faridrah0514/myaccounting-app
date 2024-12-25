"use client"
import React from "react"
import { Drawer, Form, Input, Select, Button } from "antd"

const { Option } = Select

interface TambahAkunDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: () => void
}

const TambahAkunDrawer: React.FC<TambahAkunDrawerProps> = ({ visible, onClose, onSubmit }) => {
  return (
    <Drawer title="Tambah Akun" placement="right" visible={visible} onClose={onClose} width={480}>
      <Form layout="vertical">
        <Form.Item label="Nama" name="nama" rules={[{ required: true, message: "Nama wajib diisi" }]}>
          <Input placeholder="Nama" />
        </Form.Item>
        <Form.Item label="Kode" name="kode" rules={[{ required: true, message: "Kode wajib diisi" }]}>
          <Input placeholder="Kode" />
        </Form.Item>
        <Form.Item label="Kategori" name="kategori" rules={[{ required: true, message: "Pilih kategori" }]}>
          <Select placeholder="Pilih kategori">
            <Option value="Kategori 1">Kategori 1</Option>
            <Option value="Kategori 2">Kategori 2</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Sub Akun dari" name="subAkun">
          <Select placeholder="Pilih akun">
            <Option value="Akun 1">Akun 1</Option>
            <Option value="Akun 2">Akun 2</Option>
          </Select>
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button style={{ marginRight: "8px" }} onClick={onClose}>
            Batal
          </Button>
          <Button type="primary" onClick={onSubmit}>
            + Tambah
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

export default TambahAkunDrawer
