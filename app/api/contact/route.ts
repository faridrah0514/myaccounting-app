import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { ContactSchema } from "@/app/types/types"

import logger from "@/app/utils/logger"

const logTag = "contact-api"
const log = logger(logTag)
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Parse and validate the request body
    const contactData = ContactSchema.parse(body)

    // Create the record in the Prisma contact table
    await prisma.contact.create({
      data: contactData,
    })

    // get all contacts
    const allcontacts = await prisma.contact.findMany()
    return NextResponse.json({ contacts: allcontacts }, { status: 200 })
  } catch (error) {
    log.error("Failed to add contact", error)
    return NextResponse.json({ error: "Failed to add contact" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // get all contacts
    const allcontacts = await prisma.contact.findMany()

    // Validate the fetched contacts
    const validatedContacts = allcontacts.map((contact) => ContactSchema.parse(contact))

    return NextResponse.json({ contacts: validatedContacts }, { status: 200 })
  } catch (error) {
    log.error("Failed to fetch contacts", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
