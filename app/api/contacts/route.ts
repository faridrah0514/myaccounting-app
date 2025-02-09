/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API for managing contacts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - address
 *         - province_id
 *         - city_id
 *         - district_id
 *         - village_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the contact
 *         contact_type:
 *           type: string
 *           description: The type of contact
 *         name:
 *           type: string
 *           description: The name of the contact
 *         phone:
 *           type: string
 *           description: The phone number of the contact
 *         address:
 *           type: string
 *           description: The address of the contact
 *         tax_number:
 *           type: string
 *           description: The tax number of the contact
 *           nullable: true
 *         id_type:
 *           type: string
 *           description: The type of ID
 *           nullable: true
 *         id_number:
 *           type: string
 *           description: The ID number of the contact
 *           nullable: true
 *         province_id:
 *           type: string
 *           description: The province ID of the contact
 *         city_id:
 *           type: string
 *           description: The city ID of the contact
 *         district_id:
 *           type: string
 *           description: The district ID of the contact
 *         village_id:
 *           type: string
 *           description: The village ID of the contact
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date of the contact
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update date of the contact
 *       example:
 *         id: 1
 *         contact_type: "personal"
 *         name: John Doe
 *         phone: "123-456-7890"
 *         address: "123 Main St"
 *         tax_number: "123456789"
 *         id_type: "passport"
 *         id_number: "A1234567"
 *         province_id: "01"
 *         city_id: "01"
 *         district_id: "01"
 *         village_id: "01"
 *         created_at: "2023-01-01T00:00:00.000Z"
 *         updated_at: "2023-01-02T00:00:00.000Z"
 */
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { ContactSchema } from "@/app/types/types"

import logger from "@/app/utils/logger"

const logTag = "contact-api"
const log = logger(logTag)
const prisma = new PrismaClient()

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: The list of contacts after the new contact is added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Failed to add contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: The list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Failed to fetch contacts
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
