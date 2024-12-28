/**
 * @swagger
 * tags:
 *   name: ProductCategory
 *   description: API for managing product categories
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import logger from "@/app/utils/logger"
import { ProductCategorySchema } from "@/app/types/types"

const logTag = "product-category"
const log = logger(logTag)
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/product/category:
 *   get:
 *     summary: Fetch all product categories
 *     tags: [ProductCategory]
 *     responses:
 *       200:
 *         description: A list of product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The category ID
 *                       name:
 *                         type: string
 *                         description: The category name
 *       500:
 *         description: Failed to fetch product categories
 */

export async function GET() {
  try {
    log.info("Fetching product categories")
    const categories = await prisma.productCategory.findMany({
      orderBy: { id: "asc" },
    })

    // Validate the fetched categories using ProductCategorySchema
    const validatedCategories = ProductCategorySchema.array().safeParse(categories)
    if (!validatedCategories.success) {
      throw new Error("Validation failed for fetched categories")
    }
    return NextResponse.json({ categories })
  } catch (error) {
    log.error("Failed to fetch product categories", error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/product/category:
 *   post:
 *     summary: Create a new product category
 *     tags: [ProductCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new category
 *                 example: "Electronics"
 *     responses:
 *       200:
 *         description: The created product category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newCategory:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The category ID
 *                     name:
 *                       type: string
 *                       description: The category name
 *       500:
 *         description: Failed to create product category
 */
export async function POST(request: Request) {
  try {
    log.info("Creating product category")
    const data = await request.json()

    // Validate the incoming data using ProductCategorySchema
    const parsedData = ProductCategorySchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error("Validation failed for incoming data")
    }

    await prisma.productCategory.create({
      data: parsedData.data,
    })

    const allcategories = await prisma.productCategory.findMany({
      orderBy: { id: "asc" },
    })

    // Validate the fetched categories using ProductCategorySchema
    const validatedCategories = ProductCategorySchema.array().safeParse(allcategories)
    if (!validatedCategories.success) {
      throw new Error("Validation failed for fetched categories")
    }

    return NextResponse.json({ categories: allcategories }, { status: 200 })
  } catch (error) {
    log.error("Failed to create product category", error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
