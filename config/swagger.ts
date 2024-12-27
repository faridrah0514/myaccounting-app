// config/swagger.js
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My Next.js API (App Router)",
    version: "1.0.0",
    description: "API documentation for my Next.js project using the App Router",
  },
  servers: [
    {
      url: "http://localhost:3000/api", // Adjust for your deployment
    },
  ],
  // You can add other global settings like security, tags, etc.
}

export default swaggerDefinition
