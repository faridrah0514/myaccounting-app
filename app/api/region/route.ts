import { PrismaClient, Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { RegionSchema, type RegionType } from "@/app/types/db"
import { z } from "zod"
import { toSnakeCase } from "@/app/utils/toSnakeCase"

import logger from "@/app/utils/logger"

const logTag = "region"
const log = logger(logTag)
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  log.info(`[${request.method}]-${request.url}`)
  const { searchParams } = new URL(request.url)
  const [province, city, district] = [
    searchParams.get("province"), // get city code and name
    searchParams.get("city"), // get district code and name
    searchParams.get("district"), // get village code and name
  ]

  // this is the hierarchy of the region
  // province -> city -> district -> village
  // e.g province = "32", city = "32.73", district = "32.73.01", village = "32.73.01.1001"
  const where = province || city || district

  const whereClause = district ? `${district}.%` : where ? `${where}.__` : "__"

  const query = Prisma.sql`SELECT code, name as name FROM region WHERE code LIKE ${whereClause};`
  log.info(`Query: ${query.strings}, with where clause: ${whereClause}`)
  const results: RegionType[] = await prisma.$queryRaw(query)
  const validResults = z.array(RegionSchema).parse(results)

  return NextResponse.json({ region: toSnakeCase(validResults) }, { status: 200 })
}
