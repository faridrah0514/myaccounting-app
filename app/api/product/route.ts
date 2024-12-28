/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API for managing product
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import logger from "@/app/utils/logger"
import { ProductCategorySchema, ProductUnitSchema } from "@/app/types/types"

const logTag = "product"
const log = logger(logTag)
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Fetch all product categories and units
 *     tags: [Product]
 *     description: Retrieve a list of all product categories and units from the database, validating them against predefined schemas.
 *     responses:
 *       200:
 *         description: A JSON object containing arrays of validated product categories and units.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductCategory'
 *                 units:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductUnit'
 *       500:
 *         description: Failed to fetch product categories and units.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch product categories
 */

/**
 * Fetches all product categories and units from the database.
 * Validates the fetched data using predefined schemas.
 *
 * @returns {Promise<NextResponse>} A JSON response containing validated product categories and units, or an error message.
 */
export async function GET() {
  try {
    log.info("Fetching products")
    const categories = await prisma.productCategory.findMany({
      orderBy: { id: "asc" },
    })

    const units = await prisma.productUnit.findMany({
      orderBy: { id: "asc" },
    })
    // Validate the fetched categories using ProductCategorySchema
    const validatedCategories = ProductCategorySchema.array().safeParse(categories)
    if (!validatedCategories.success) {
      throw new Error("Validation failed for fetched categories")
    }

    const validatedUnits = ProductUnitSchema.array().safeParse(units)
    if (!validatedUnits.success) {
      throw new Error("Validation failed for fetched units")
    }
    return NextResponse.json({ categories: validatedCategories.data, units: validatedUnits.data })
  } catch (error) {
    log.error("Failed to fetch product categories", error)
    return NextResponse.json({ message: "Failed to fetch product categories" }, { status: 500 })
  }
}
