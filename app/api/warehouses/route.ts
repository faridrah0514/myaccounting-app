/**
 * @swagger
 * tags:
 *   name: Warehouse
 *   description: API for managing warehouse
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the warehouse
 *         warehouse_name:
 *           type: string
 *           description: The name of the warehouse
 *         warehouse_code:
 *           type: string
 *           description: The code of the warehouse
 *         description:
 *           type: string
 *           description: The description of the warehouse
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp of the warehouse
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp of the warehouse
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { WarehouseSchema } from "@/app/types/types"

import logger from "@/app/utils/logger"

const prisma = new PrismaClient()
const logTag = "warehouse-api"
const log = logger(logTag)

/**
 * @swagger
 * /api/warehouse:
 *   get:
 *     summary: Retrieve a list of warehouses
 *     description: Fetches all warehouses from the database and validates the data against the WarehouseSchema.
 *     responses:
 *       200:
 *         description: A list of warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 warehouses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation failed
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Failed to fetch warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch warehouses
 */
export async function GET() {
  try {
    log.info("Retrieving warehouse data")
    const allWarehouses = await prisma.warehouse.findMany()

    const validatedWarehouse = WarehouseSchema.array().safeParse(allWarehouses)

    if (!validatedWarehouse.success) {
      log.error("Validation failed", validatedWarehouse.error)
      return NextResponse.json(
        { error: "Validation failed", details: validatedWarehouse.error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ warehouses: validatedWarehouse.data }, { status: 200 })
  } catch (error) {
    log.error("Failed to fetch warehouses", error)
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/warehouse:
 *   post:
 *     summary: Create a new warehouse
 *     description: Adds a new warehouse to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: Warehouse created successfully and returns the list of warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 warehouses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation failed
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Failed to create warehouse
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create warehouse
 */
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const validatedWarehouse = WarehouseSchema.safeParse(json)

    if (!validatedWarehouse.success) {
      log.error("Validation failed", validatedWarehouse.error)
      return NextResponse.json(
        { error: "Validation failed", details: validatedWarehouse.error.errors },
        { status: 400 }
      )
    }

    await prisma.warehouse.create({
      data: validatedWarehouse.data,
    })

    const allWarehouses = await prisma.warehouse.findMany()

    const validatedWarehouses = WarehouseSchema.array().safeParse(allWarehouses)

    if (!validatedWarehouses.success) {
      throw new Error("Validation failed for fetched warehouses")
    }

    return NextResponse.json({ warehouses: validatedWarehouses.data }, { status: 200 })
  } catch (error) {
    log.error("Failed to create warehouse", error)
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 })
  }
}
