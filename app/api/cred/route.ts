/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import dayjs from "dayjs"
import logger from "@/app/utils/logger"

const logTag = "cred"
const log = logger(logTag)

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

/**
 * @swagger
 * /api/cred:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID
 *                       username:
 *                         type: string
 *                         description: The username
 *                       role:
 *                         type: string
 *                         description: The user role
 *                       createdAt:
 *                         type: string
 *                         description: The creation date
 *                         format: date
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    log.info("Fetching users...")
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
      },
    })

    const formattedData = users.map((user) => ({
      ...user,
      createdAt: dayjs(user.created_at).format("DD-MM-YYYY"),
    }))

    return new Response(JSON.stringify({ data: formattedData }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    log.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/cred:
 *   post:
 *     summary: Create a new user or update a user's password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestType:
 *                 type: string
 *                 description: The type of request (add-user or update-password)
 *               data:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: The username
 *                   password:
 *                     type: string
 *                     description: The password
 *                   role:
 *                     type: string
 *                     description: The user role
 *                   editable_until:
 *                     type: string
 *                     description: The editable until date
 *                     format: date
 *               username:
 *                 type: string
 *                 description: The username for password update
 *               oldPassword:
 *                 type: string
 *                 description: The old password
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (data.requestType === "add-user") {
      const { username, password, role, editable_until } = data.data

      // Validate input fields
      if (!username || !password || !role) {
        return NextResponse.json({ message: "Username, password, and role are required" }, { status: 400 })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

      // Check if the username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })

      if (existingUser) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 })
      }

      // Create the user
      await prisma.user.create({
        data: {
          username,
          password_hash: hashedPassword,
          role,
          ...(role === "SUPERVISOR" && editable_until ? { editableUntil: editable_until } : {}),
        },
      })

      return NextResponse.json({ message: "User created successfully" }, { status: 201 })
    } else {
      // Handle password update
      const { username, oldPassword, newPassword } = data

      if (!oldPassword || !newPassword) {
        return NextResponse.json({ message: "Old password and new password are required" }, { status: 400 })
      }

      // Fetch the user
      const user = await prisma.user.findUnique({
        where: { username },
      })

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      // Validate old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash)

      if (!isOldPasswordValid) {
        return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 })
      }

      // Update the password
      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

      await prisma.user.update({
        where: { username },
        data: { password_hash: hashedNewPassword },
      })

      return NextResponse.json({ message: "Password updated successfully" })
    }
  } catch (error) {
    log.error("Error handling request:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/cred:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestType:
 *                 type: string
 *                 description: The type of request (delete-user)
 *               id:
 *                 type: integer
 *                 description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(req: NextRequest) {
  try {
    const { requestType, id } = await req.json()

    if (requestType === "delete-user") {
      if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 })
      }

      // Check if the user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      })

      if (!existingUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: parseInt(id) },
      })

      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
    }

    return NextResponse.json({ message: "Invalid request type" }, { status: 400 })
  } catch (error) {
    log.error("Error deleting user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
