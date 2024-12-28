import { z } from "zod"

export const ContactTypeEnumSchema = z.enum(["Perusahaan", "Personal"])
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
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export const ProductCategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export const ProductUnitSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Put the types here
export type ContactType = z.infer<typeof ContactSchema>
export type UserType = z.infer<typeof UserSchema>
export type RegionType = z.infer<typeof RegionSchema>
export type ProductCategoryType = z.infer<typeof ProductCategorySchema>
export type ProductUnitType = z.infer<typeof ProductUnitSchema>
