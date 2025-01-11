/**
 * @swagger
 * tags:
 *   name: ProductUnit
 *   description: API for managing product units
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import logger from "@/app/utils/logger"
import { ProductUnitSchema } from "@/app/types/types"

const logTag = "product-unit"
const log = logger(logTag)
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/products/units:
 *   get:
 *     summary: Fetch all product units
 *     tags: [ProductUnit]
 *     responses:
 *       200:
 *         description: A list of product units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 units:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unit ID
 *                       name:
 *                         type: string
 *                         description: The unit name
 *       500:
 *         description: Failed to fetch product units
 */

export async function GET() {
  try {
    log.info("Fetching product units")
    const units = await prisma.productUnit.findMany({
      orderBy: { id: "asc" },
    })

    // Validate the fetched units using ProductUnitSchema
    const validatedUnits = ProductUnitSchema.array().safeParse(units)
    if (!validatedUnits.success) {
      throw new Error("Validation failed for fetched units")
    }
    return NextResponse.json({ units })
  } catch (error) {
    log.error("Failed to fetch product units", error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/products/units:
 *   post:
 *     summary: Create a new product unit
 *     tags: [ProductUnit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new unit
 *                 example: "Electronics"
 *     responses:
 *       200:
 *         description: The created product unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newUnit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unit ID
 *                     name:
 *                       type: string
 *                       description: The unit name
 *       500:
 *         description: Failed to create product unit
 */
export async function POST(request: Request) {
  try {
    log.info("Creating product unit")
    const data = await request.json()

    // Validate the incoming data using ProductUnitSchema
    const parsedData = ProductUnitSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error("Validation failed for incoming data")
    }

    await prisma.productUnit.create({
      data: parsedData.data,
    })

    const allunits = await prisma.productUnit.findMany({
      orderBy: { id: "asc" },
    })

    // Validate the fetched units using UnitSchema
    const validatedUnits = ProductUnitSchema.array().safeParse(allunits)
    if (!validatedUnits.success) {
      throw new Error("Validation failed for fetched units")
    }

    return NextResponse.json({ units: allunits }, { status: 200 })
  } catch (error) {
    log.error("Failed to create product unit", error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
