import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
})

export const RegionSchema = z.object({
  code: z.string(),
  name: z.string(),
})

export type UserType = z.infer<typeof UserSchema>
export type RegionType = z.infer<typeof RegionSchema>
