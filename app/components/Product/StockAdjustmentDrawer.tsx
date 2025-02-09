"use client"
import { Drawer, Form, DatePicker, Input, Select, Button, Typography, Row, Col, Radio, Flex, message } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import type { CheckboxGroupProps } from "antd/es/checkbox"
import { numericOnly, currencyFormatter } from "@/app/utils/utils"
import type { WarehouseType, StockMovementType } from "@/app/types/types"
import { useState } from "react"
const { Option } = Select
const { Title, Text } = Typography
import { flattenAccounts } from "@/app/utils/utils"

const options: CheckboxGroupProps<string>["options"] = [
  { label: "Perhitungan Stock", value: "1" },
  { label: "Stock Masuk / Keluar", value: "2", disabled: true },
]

const StockAdjustmentDrawer = ({
  productId,
  visible,
  onClose,
  accountData,
  warehouseData,
}: {
  productId: number
  visible: boolean
  onClose: () => void
  accountData: any[] | undefined
  warehouseData: WarehouseType[] | undefined
}) => {
  const [form] = Form.useForm()
  const [actualQty, setActualQty] = useState<number>(0)
  const [recordedQty, setRecordedQty] = useState<number>(0)

  const onFinish = (values: StockMovementType) => {
    fetch("/api/stock/movement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        message.success("Penyesuaian stok berhasil disimpan")
        onClose()
      })
      .catch((error) => {
        message.error("Gagal menyimpan penyesuaian stok")
      })
  }

  return (
    <Drawer
      title={
        <Title level={4} style={{ margin: 0 }}>
          Penyesuaian Stok
        </Title>
      }
      width={600}
      onClose={onClose}
      open={visible}
      closable={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
      bodyStyle={{ padding: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const stockMovement: StockMovementType = {
            product_id: Number(productId),
            avg_price: numericOnly(values.avg_price),
            trans_date: values.date,
            warehouse_id: values.warehouse_id,
            qty: Number(values.actual_qty),
            qty_movement: Number(values.actual_qty) - Number(recordedQty),
            price: numericOnly(values.avg_price),
            account_id: values.account_id,
            code: values.code,
            reference: values.reference,
            trans_type: values.trans_type_id,
          }

          console.log("stock movement: ", stockMovement)
          onFinish(stockMovement)
        }}
      >
        {/* Adjustment Type Section */}
        <Form.Item name="trans_type_id" label={<Text strong>Tipe penyesuaian stok</Text>} initialValue={"1"}>
          <Radio.Group options={options}></Radio.Group>
        </Form.Item>

        {/* Warehouse and Date Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="warehouse_id"
              label={<Text strong>Gudang</Text>}
              rules={[{ required: true, message: "Gudang harus dipilih" }]}
            >
              <Select placeholder="Pilih Gudang" allowClear>
                {warehouseData
                  ? warehouseData.map((warehouse, key) => (
                      <Option key={key} value={warehouse.id}>
                        {warehouse.warehouse_name}
                      </Option>
                    ))
                  : null}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date"
              label={<Text strong>Tanggal</Text>}
              rules={[{ required: true, message: "Tanggal harus dipilih" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Account Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="account_id" label={<Text strong>Akun</Text>} initialValue={164}>
              <Select placeholder="Pilih Akun" allowClear>
                {accountData
                  ? accountData
                      .flatMap((account) => flattenAccounts([account]))
                      .map((account, key) => (
                        <Option key={key} value={account.id}>
                          {account.ref_code} - {account.name}
                        </Option>
                      ))
                  : null}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="code" label={<Text strong>Nomor</Text>}>
              <Input placeholder="SA/00012" />
            </Form.Item>
          </Col>
        </Row>

        {/* Reference Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="reference" label={<Text strong>Referensi</Text>}>
              <Input placeholder="Masukkan referensi" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tags" label={<Text strong>Pilih Tag</Text>}>
              <Select mode="tags" placeholder="Pilih Tag" disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Product Section */}
        <Row gutter={16}>
          <Col span={6}>
            <Flex vertical gap={8}>
              <Text strong>Qty Tercatat</Text>
              <Text strong>0</Text>
            </Flex>
          </Col>
          <Col span={6}>
            <Form.Item name="actual_qty" label={<Text strong>Qty Aktual</Text>}>
              {/* <Input type="number" /> */}
              <Input type="number" value={actualQty} onChange={(e) => setActualQty(Number(e.target.value))} />
            </Form.Item>
            {/* <Flex vertical gap={8}>
              <Text strong>Qty Aktual</Text>
              <Text strong>0</Text>
            </Flex> */}
          </Col>
          <Col span={4}>
            {/* <Form.Item name="deviation" label={<Text strong>Selisih</Text>}>
              <Input type="number" />
            </Form.Item> */}
            <Flex vertical gap={8}>
              <Text strong>Selisih</Text>
              <Text strong>{actualQty !== undefined ? actualQty - recordedQty : 0}</Text>
            </Flex>
          </Col>
          <Col span={8}>
            <Form.Item name="avg_price" label={<Text strong>Harga Rata-rata (Rp)</Text>}>
              <Input
                placeholder="Harga rata-rata"
                onChange={(e) => {
                  const sanitizedValue = numericOnly(e.target.value)
                  form.setFieldsValue({
                    avg_price: currencyFormatter(sanitizedValue.toString()),
                  })
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row justify="end" gutter={8}>
          <Col>
            <Button size="large" onClick={onClose}>
              Batal
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="large" htmlType="submit">
              Simpan
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export default StockAdjustmentDrawer
