import React from "react"
import { Input, Select } from "antd"
import { MinusCircleOutlined } from "@ant-design/icons"

const { Option } = Select

interface ColumnProps {
  onFieldChange: (key: number, field: string, value: any) => void
  removeTableRow: (key: number) => void
  showAkunDrawer: () => void
}

const getColumns = ({ onFieldChange, removeTableRow, showAkunDrawer }: ColumnProps) => [
  {
    title: "Akun Biaya",
    dataIndex: "akun",
    render: (_: any, record: any) => (
      <Select
        placeholder="Pilih sumber"
        allowClear
        value={record.akun}
        onChange={(value) => onFieldChange(record.key, "akun", value)}
        style={{ width: "100%" }}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <div style={{ padding: "8px", cursor: "pointer", color: "#1890ff" }} onClick={showAkunDrawer}>
              + Tambah Akun
            </div>
          </div>
        )}
      >
        <Option value="1-10001 Kas">1-10001 Kas</Option>
      </Select>
    ),
  },
  {
    title: "Deskripsi",
    dataIndex: "deskripsi",
    render: (_: any, record: any) => (
      <Input
        placeholder="Deskripsi"
        value={record.deskripsi}
        onChange={(e) => onFieldChange(record.key, "deskripsi", e.target.value)}
      />
    ),
  },
  {
    title: "Pajak",
    dataIndex: "pajak",
    render: (_: any, record: any) => (
      <Select
        placeholder="Pilih pajak"
        value={record.pajak}
        onChange={(value) => onFieldChange(record.key, "pajak", value)}
        style={{ width: "100%" }}
      >
        <Option value="0">0%</Option>
        <Option value="10">10%</Option>
      </Select>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    render: (_: any, record: any) => (
      <Input
        placeholder="0"
        value={record.total}
        onChange={(value) => onFieldChange(record.key, "total", value)}
        style={{ width: "100%" }}
      />
    ),
  },
  {
    title: "",
    dataIndex: "action",
    render: (_: any, record: any) => (
      <MinusCircleOutlined onClick={() => removeTableRow(record.key)} style={{ cursor: "pointer" }} />
    ),
  },
]

export default getColumns
