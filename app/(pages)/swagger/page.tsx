// app/swagger/page.js
"use client"

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default function SwaggerPage() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <SwaggerUI url="/api/swagger" />
    </div>
  )
}
