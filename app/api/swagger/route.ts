// app/api/swagger/route.js
import { NextResponse } from "next/server"
import { createSwaggerSpec } from "next-swagger-doc"
import swaggerDefinition from "../../../config/swagger"

export async function GET() {
  const swaggerSpec = createSwaggerSpec({
    definition: swaggerDefinition,
    // If you want next-swagger-doc to parse your route files for JSDoc comments:
    apis: ["app/api/**/*.js", "app/api/**/*.ts"],
  })

  return NextResponse.json(swaggerSpec)
}
