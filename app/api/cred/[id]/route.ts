import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import logger from '@/app/utils/logger'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

const logTag = 'cred-id'
const log = logger(logTag)

// GET request to fetch user details by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  try {
    // Find user details using prisma
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const formattedUser = {
      ...user,
      created_at: dayjs(user.createdAt).format('DD-MM-YYYY'),
    }
    log.info(`Fetched user details for user ID: ${userId}`)
    return NextResponse.json(formattedUser, { status: 200 })
  } catch (error) {
    log.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// PUT request to update user details by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  try {
    const { requestType, data } = await req.json()

    if (requestType === 'edit-user') {
      const { username, password, role } = data

      if (!username || !role) {
        return NextResponse.json({ message: 'Username and role are required' }, { status: 400 })
      }

      // Find user details using prisma
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      })

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
      }

      // Update user details (password only if provided)
      if (password) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: {
            username,
            passwordHash: hashedPassword,
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
      return NextResponse.json({ message: 'User updated successfully' }, { status: 200 })
    }
    log.warn(`Unhandled request type: ${requestType} for user ID: ${userId}`)
    return NextResponse.json({ message: 'Invalid request type' }, { status: 400 })
  } catch (error) {
    log.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
