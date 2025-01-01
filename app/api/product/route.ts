/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API for managing product
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import logger from "@/app/utils/logger"
import { ProductSchema, ProductUnitSchema, ProductCategorySchema } from "@/app/types/types"

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

    // const products = await prisma.product.findMany()
    const products = await prisma.product.findMany({
      include: {
        product_category: {
          select: {
            name: true,
          },
        },
        product_unit: {
          select: {
            name: true,
          },
        },
      },
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
    // Validate the fetched products using ProductSchema
    const validatedProducts = ProductSchema.array().safeParse(products)
    if (!validatedProducts.success) {
      throw new Error("Validation failed for fetched products")
    }

    return NextResponse.json(
      {
        categories: validatedCategories.data,
        units: validatedUnits.data,
        products: validatedProducts.data.map((product) => ({
          ...product,
          product_category: product.product_category?.name,
          product_unit: product.product_unit?.name,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    log.error("Failed to fetch product categories", error)
    return NextResponse.json({ message: "Failed to fetch product categories" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     description: Create a new product in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Successfully created a new product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *       500:
 *         description: Failed to create product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create product
 */

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const validatedProduct = ProductSchema.safeParse(data)
    if (!validatedProduct.success) {
      return NextResponse.json({ message: "Invalid product data" }, { status: 400 })
    }

    log.info("Creating product")
    await prisma.product.create({ data: validatedProduct.data })

    const allProducts = await prisma.product.findMany()

    // Validate the fetched products using ProductSchema
    const validatedProducts = ProductSchema.array().safeParse(allProducts)
    if (!validatedProducts.success) {
      throw new Error("Validation failed for fetched products")
    }

    return NextResponse.json({ products: validatedProducts.data }, { status: 200 })
  } catch (error) {
    log.error("Failed to create product", error)
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
  }
}
