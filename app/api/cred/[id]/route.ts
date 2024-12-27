import dayjs from "dayjs"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import logger from "@/app/utils/logger"

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

const logTag = "cred-id"
const log = logger(logTag)

/**
 * @swagger
 * /api/cred/{id}:
 *   get:
 *     summary: Fetch user details by ID
 *     tags: [Users]
 *     description: Retrieve user details using the user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * GET request to fetch user details by ID
 * @param {NextRequest} req - The incoming request object
 * @param {Object} params - The route parameters
 * @param {string} params.id - The user ID
 * @returns {Promise<NextResponse>} The response containing user details or an error message
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  try {
    // Find user details using prisma
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const formattedUser = {
      ...user,
      created_at: dayjs(user.created_at).format("DD-MM-YYYY"),
    }
    log.info(`Fetched user details for user ID: ${userId}`)
    return NextResponse.json(formattedUser, { status: 200 })
  } catch (error) {
    log.error(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/cred/{id}:
 *   put:
 *     summary: Update user details by ID
 *     tags: [Users]
 *     description: Update user details using the user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestType:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request type or missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * PUT request to update user details by ID
 * @param {NextRequest} req - The incoming request object
 * @param {Object} params - The route parameters
 * @param {string} params.id - The user ID
 * @returns {Promise<NextResponse>} The response indicating success or failure of the update operation
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  try {
    const { requestType, data } = await req.json()

    if (requestType === "edit-user") {
      const { username, password, role } = data

      if (!username || !role) {
        return NextResponse.json({ message: "Username and role are required" }, { status: 400 })
      }

      // Find user details using prisma
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      })

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      // Update user details (password only if provided)
      if (password) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: {
            username,
            password_hash: hashedPassword,
            role,
          },
        })
      } else {
        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: {
            username,
            role,
          },
        })
      }
      log.info(`Updated user details for user ID: ${userId}`)
      return NextResponse.json({ message: "User updated successfully" }, { status: 200 })
    }
    log.warn(`Unhandled request type: ${requestType} for user ID: ${userId}`)
    return NextResponse.json({ message: "Invalid request type" }, { status: 400 })
  } catch (error) {
    log.error(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
