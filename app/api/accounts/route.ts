/**
 * @swagger
 * tags:
 *   name: FinanceAccounts
 *   description: API for managing Finance Accounts
 */

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { FinanceAccountSchema, FinanceAccountCategorySchema, type FinanceAccountType } from "@/app/types/types"
import logger from "@/app/utils/logger"

const logTag = "finance-account-api"
const log = logger(logTag)
const prisma = new PrismaClient()

async function getFinanceAccountsWithChildren(prisma, parentId = null) {
  const accounts = await prisma.financeAccount.findMany({
    where: { parent_id: parentId }, // Fetch accounts for the given parent ID
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  // For each account, recursively fetch its children
  return Promise.all(
    accounts.map(async (account: FinanceAccountType) => ({
      ...account,
      children: await getFinanceAccountsWithChildren(prisma, account.id), // Fetch children recursively
    }))
  )
}

function removeEmptyChildren(accounts: FinanceAccountType[]) {
  return accounts.map((account) => {
    if (account.children && account.children.length > 0) {
      account.children = removeEmptyChildren(account.children)
    } else {
      delete account.children
    }
    return account
  })
}

async function getFinanceAccountsResponse(): Promise<FinanceAccountType[]> {
  let financeAccounts = await getFinanceAccountsWithChildren(prisma)

  financeAccounts = removeEmptyChildren(financeAccounts.filter((account) => !account.parent_id))

  return financeAccounts
}
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
    const financeAccounts = await getFinanceAccountsResponse()

    const financeAccountCategries = await prisma.financeAccountCategory.findMany()

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

    log.info("Validating finance account categories")
    const validatedFinanceAccountCategories = financeAccountCategries.map((category) => {
      const result = FinanceAccountCategorySchema.safeParse(category)
      if (!result.success) {
        log.error(`Validation failed for category: ${JSON.stringify(result.error.issues)}`)
        throw new Error(`Validation failed for category: ${JSON.stringify(result.error.issues)}`)
      }
      return result.data
    })
    return NextResponse.json(
      { finance_accounts: validatedFinanceAccounts, finance_account_categories: validatedFinanceAccountCategories },
      { status: 200 }
    )
  } catch (error) {
    log.error(`Error fetching or validating finance accounts: ${error}`)
    return NextResponse.json({ error: "Failed to fetch or validate finance accounts" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Add a finance account
 *     tags: [FinanceAccounts]
 *     description: Add a finance account to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category_id:
 *                 type: string
 *               parent_id:
 *                 type: string
 *               is_parent:
 *                 type: integer
 *               is_active:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added a finance account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finance_accounts:
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
 *         description: Failed to add a finance account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = FinanceAccountSchema.safeParse(body)
    if (!result.success) {
      log.error(`Validation failed for account: ${JSON.stringify(result.error.issues)}`)
      throw new Error(`Validation failed for account: ${JSON.stringify(result.error.issues)}`)
    }
    const financeAccountData = result.data

    if (financeAccountData.parent_id) {
      await prisma.financeAccount.update({
        where: { id: financeAccountData.parent_id },
        data: { is_parent: 1 },
      })
    }
    await prisma.financeAccount.create({
      data: financeAccountData,
    })

    const financeAccounts: FinanceAccountType[] = await getFinanceAccountsResponse()

    // Filter out the children from the outer list
    let financeAccountsResponseData = financeAccounts.filter((account) => !account.parent_id)

    const validationResult = FinanceAccountSchema.array().safeParse(financeAccountsResponseData)
    if (!validationResult.success) {
      log.error(
        `Validation failed for finance accounts response data: ${JSON.stringify(validationResult.error.issues)}`
      )
      throw new Error(
        `Validation failed for finance accounts response data: ${JSON.stringify(validationResult.error.issues)}`
      )
    }
    financeAccountsResponseData = validationResult.data

    return NextResponse.json({ finance_accounts: financeAccountsResponseData }, { status: 200 })
    // return NextResponse.json({ message: "Success" }, { status: 200 })
  } catch (error) {
    log.error("Failed to add finance account", error)
    return NextResponse.json({ error: "Failed to add finance account" }, { status: 500 })
  }
}
