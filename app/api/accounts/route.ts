/**
 * @swagger
 * tags:
 *   name: FinanceAccounts
 *   description: API for managing Finance Accounts
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { FinanceAccountSchema } from "@/app/types/types"
import logger from "@/app/utils/logger"

const logTag = "finance-account-api"
const log = logger(logTag)
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Fetch and validate finance accounts
 *    tags: [FinanceAccounts]
 *     description: Fetches finance accounts from the database, validates them, and returns the validated accounts.
 *     responses:
 *       200:
 *         description: Successfully fetched and validated finance accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 financeAccounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       500:
 *         description: Failed to fetch or validate finance accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET() {
  try {
    log.info("Fetching finance accounts")
    const financeAccounts = await prisma.financeAccount.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    log.info("Validating finance accounts")
    const validatedFinanceAccounts = financeAccounts.map((account) => {
      const result = FinanceAccountSchema.safeParse(account)
      if (!result.success) {
        log.error(`Validation failed for account: ${JSON.stringify(result.error.issues)}`)
        throw new Error(`Validation failed for account: ${JSON.stringify(result.error.issues)}`)
      }
      return result.data
    })

    log.info("Successfully fetched and validated finance accounts")
    return NextResponse.json({ financeAccounts: validatedFinanceAccounts }, { status: 200 })
  } catch (error) {
    log.error(`Error fetching or validating finance accounts: ${error}`)
    return NextResponse.json({ error: "Failed to fetch or validate finance accounts" }, { status: 500 })
  }
}
