import React from "react"
import { Input, Select } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { type FinanceAccountType } from "@/app/types/types"
import { numericOnly, currencyFormatter } from "@/app/utils/utils"
const { Option } = Select

interface ColumnProps {
  onFieldChange: (key: number, field: string, value: any) => void
  removeTableRow: (key: number) => void
  showAkunDrawer: () => void
  accountData: FinanceAccountType[]
}

const getColumns = ({ onFieldChange, removeTableRow, showAkunDrawer, accountData }: ColumnProps) => [
  {
    title: "Akun",
    dataIndex: "account_id",
    width: "20%",
    render: (_: any, record: any) => (
      <Select
        placeholder="Pilih sumber"
        allowClear
        value={record.account_id}
        onChange={(value) => onFieldChange(record.key, "account_id", value)}
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
        {accountData?.map((account) => (
          <Option key={account.id} value={account.id}>
            {account.ref_code} - {account.name}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    title: "Deskripsi",
    dataIndex: "description",
    render: (_: any, record: any) => (
      <Input
        placeholder="Deskripsi"
        value={record.description}
        onChange={(e) => onFieldChange(record.key, "description", e.target.value)}
      />
    ),
  },
  {
    title: "Pajak",
    dataIndex: "tax",
    render: (_: any, record: any) => (
      <Select
        placeholder="Pilih pajak"
        value={record.tax}
        onChange={(value) => onFieldChange(record.key, "tax", value)}
        style={{ width: "100%" }}
        // disabled
      >
        <Option value={11}>PPN</Option>
        {/* <Option value={12}>PPH</Option> */}
      </Select>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    render: (_: any, record: any) => (
      <Input
        placeholder="0"
        value={currencyFormatter(record.total?.toString() || "0")}
        onChange={(e) => {
          const sanitizedValue = numericOnly(e.target.value)
          onFieldChange(record.key, "total", sanitizedValue)
        }}
        style={{ width: "100%" }}
      />
    ),
  },
  {
    title: "",
    dataIndex: "action",
    render: (_: any, record: any) => (
      <div style={{ border: "1px solid #ff4d4f", borderRadius: "4px", display: "inline-block", padding: "4px" }}>
        <DeleteOutlined onClick={() => removeTableRow(record.key)} style={{ cursor: "pointer", color: "#ff4d4f" }} />
      </div>
    ),
  },
]

export default getColumns
