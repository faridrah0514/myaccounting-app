import { z } from "zod"

export const ContactTypeEnumSchema = z.enum(["Pelanggan", "Vendor", "Pegawai", "Lainnya"])
export const IdTypeEnumSchema = z.enum(["KTP", "SIM", "Passport", "KITAS", "KITAP", "Lainnya"])

// Put the schema here
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
})

export const RegionSchema = z.object({
  code: z.string(),
  name: z.string(),
})

export const ContactSchema = z.object({
  id: z.number().optional(),
  contact_type: ContactTypeEnumSchema.optional(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  tax_number: z.string().optional().nullable(),
  id_type: IdTypeEnumSchema.optional().nullable(),
  id_number: z.string().optional().nullable(),
  province_id: z.string(),
  city_id: z.string(),
  district_id: z.string(),
  village_id: z.string(),
})

export const ProductCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
})

export const ProductUnitSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
})

export const ProductSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string(),
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  stock: z.number().optional().nullable(),
  is_purchase: z.boolean().nullable(),
  purchase_price: z.number().nullable(),
  is_sell: z.boolean().nullable(),
  sell_price: z.number().nullable(),
  product_category_id: z.number(),
  product_unit_id: z.number(),
  qty_type: z.string().nullable(),
  product_category: z
    .lazy(() => ProductCategorySchema)
    .optional()
    .nullable(),
  product_unit: z
    .lazy(() => ProductUnitSchema)
    .optional()
    .nullable(),
})

export const FinanceAccountCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  debit_normal_account: z.number().optional().nullable(),
})

export const FinanceAccountSchema: z.ZodSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  ref_code: z.string(),
  finance_account_category_id: z.number(),
  is_locked: z.number().optional().nullable(),
  parent_id: z.number().optional().nullable(),
  is_parent: z.number().optional().nullable(),
  currency_id: z.number().optional().nullable(),
  desc: z.string().optional().nullable(),
  is_deletable: z.boolean().optional().nullable(),
  balance: z.number().optional().nullable(),
  max_date: z.string().optional().nullable(),
  parent: z
    .lazy((): z.ZodSchema => FinanceAccountSchema)
    .optional()
    .nullable(),
  children: z
    .array(z.lazy((): z.ZodSchema => FinanceAccountSchema))
    .optional()
    .nullable(),
  category: z
    .lazy((): z.ZodSchema => FinanceAccountCategorySchema)
    .optional()
    .nullable(),
})

export const WarehouseSchema = z.object({
  id: z.number().optional(),
  warehouse_name: z.string(),
  warehouse_code: z.string(),
  description: z.string().optional().nullable(),
})

export const StockMovementSchema = z.object({
  id: z.number().optional(),
  business_tran_id: z.number().optional().nullable(),
  trans_type_id: z.number().optional().nullable(),
  product_id: z.number(),
  trans_date: z.string().or(z.date()).pipe(z.coerce.date()),
  warehouse_id: z.number(),
  account_id: z.number(),
  qty: z.number().int(),
  qty_movement: z.number().int(),
  description: z.string().optional().nullable(),
  avg_price: z
    .union([z.number(), z.object({}).transform((obj) => Number(obj.toString()))])
    .optional()
    .nullable(),
  price: z
    .union([z.number(), z.object({}).transform((obj) => Number(obj.toString()))])
    .optional()
    .nullable(),
  code: z.string().optional().nullable(),
  trans_type: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  valid: z.boolean().optional().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  product: z.lazy(() => ProductSchema).optional(),
  warehouse: z.lazy(() => WarehouseSchema).optional(),
})

export const StockSchema = z.object({
  id: z.number().optional(),
  product_id: z.number(),
  warehouse_id: z.number(),
  quantity: z.number().int(),
  last_updated: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  product: z.lazy(() => ProductSchema).optional(),
  warehouse: z.lazy(() => WarehouseSchema).optional(),
})

// Put the types here
export type ContactType = z.infer<typeof ContactSchema>
export type UserType = z.infer<typeof UserSchema>
export type RegionType = z.infer<typeof RegionSchema>
export type ProductCategoryType = z.infer<typeof ProductCategorySchema>
export type ProductUnitType = z.infer<typeof ProductUnitSchema>
export type ProductType = z.infer<typeof ProductSchema>
export type FinanceAccountCategoryType = z.infer<typeof FinanceAccountCategorySchema>
export type FinanceAccountType = z.infer<typeof FinanceAccountSchema>
export type WarehouseType = z.infer<typeof WarehouseSchema>
export type StockMovementType = z.infer<typeof StockMovementSchema>
export type StockType = z.infer<typeof StockSchema>
