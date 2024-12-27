import { PrismaClient, Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { RegionSchema, type RegionType } from "@/app/types/types"
import { z } from "zod"
import { toSnakeCase } from "@/app/utils/toSnakeCase"

import logger from "@/app/utils/logger"

const logTag = "region"
const log = logger(logTag)
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/region:
 *   get:
 *     tags:
 *       - Region
 *     summary: Retrieve a list of regions based on the provided hierarchy.
 *     description: Fetches regions from the database based on the provided province, city, or district codes. The hierarchy is province -> city -> district -> village.
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: The code of the province.
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: The code of the city.
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: The code of the district.
 *     responses:
 *       200:
 *         description: A list of regions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 region:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *       400:
 *         description: Invalid request parameters.
 *       500:
 *         description: Internal server error.
 */

/**
 * Handles GET requests to fetch regions based on the provided hierarchy.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response containing the list of regions.
 */
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
