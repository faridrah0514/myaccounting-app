/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client")
const { financeAccount, financeAccountCategories } = require("./data/data")

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding account categories...")
  for (const category of financeAccountCategories) {
    await prisma.financeAccountCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    })
  }

  console.log("Seeding finance account account categories...")
  for (const account of financeAccount.data) {
    await prisma.financeAccount.upsert({
      where: { id: account.id },
      update: {},
      create: account,
    })
  }
  console.log("Seeding completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
