import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { StockMovementSchema } from "@/app/types/types"

import logger from "@/app/utils/logger"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()
const logTag = "stock-movement-api"
const log = logger(logTag)

async function fetchAndValidateStockMovements(trans_date?: string, warehouse_id?: string) {
  try {
    const where: any = {}
    if (trans_date) where.trans_date = trans_date
    if (warehouse_id) where.warehouse_id = warehouse_id

    const stockMovements = await prisma.stockMovement.findMany({ where })
    const validatedStockMovements = StockMovementSchema.array().safeParse(stockMovements)

    if (!validatedStockMovements.success) {
      log.error("Validation failed for stock movements", validatedStockMovements.error)
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedStockMovements.error.errors,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ stock_movements: validatedStockMovements.data }, { status: 200 })
  } catch (error) {
    log.error("Error fetching stock movements", error)
    return NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const trans_date = searchParams.get("trans_date") || undefined
  const warehouse_id = searchParams.get("warehouse_id") || undefined

  return fetchAndValidateStockMovements(trans_date, warehouse_id)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedBody = StockMovementSchema.safeParse(body)

    if (!parsedBody.success) {
      log.error("Validation failed for stock movement", parsedBody.error)
      return NextResponse.json({ error: "Validation failed", details: parsedBody.error.errors }, { status: 400 })
    }

    await prisma.stockMovement.create({
      data: parsedBody.data,
    })

    return fetchAndValidateStockMovements()
  } catch (error) {
    log.error("Error creating stock movement", error)
    return NextResponse.json({ error: "Failed to create stock movement" }, { status: 500 })
  }
}
