// config/swagger.ts
const swagger = {
  openapi: "3.0.0",
  info: {
    title: "My Next.js API (App Router)",
    version: "1.0.0",
    description: "API documentation for my Next.js project using the App Router",
  },
  servers: [
    {
      url: "http://localhost:3000/", // Adjust for your deployment
    },
  ],
  // You can add other global settings like security, tags, etc.
}

export default swagger
// This file contains the global settings for the Swagger documentation. You can add other settings like security, tags, etc. The servers array contains the URL of your deployment. Adjust it to match your deployment URL.
