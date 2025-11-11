import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10)
  const clientPassword = await bcrypt.hash("Admin123!", 10)

  await prisma.user.upsert({
    where: { email: "admin@sneakstreet.com" },
    update: {
      name: "Admin",
      role: "ADMIN",
      passwordHash: adminPassword,
    },
    create: {
      name: "Admin",
      email: "admin@sneakstreet.com",
      role: "ADMIN",
      passwordHash: adminPassword,
    },
  })

  await prisma.user.upsert({
    where: { email: "cliente@sneakstreet.com" },
    update: {
      name: "Cliente",
      role: "CLIENT",
      passwordHash: clientPassword,
    },
    create: {
      name: "Cliente",
      email: "cliente@sneakstreet.com",
      role: "CLIENT",
      passwordHash: clientPassword,
    },
  })
}

main()
  .then(() => {
    console.log("✅ Usuários admin e cliente criados/atualizados com sucesso.")
  })
  .catch((err) => {
    console.error("❌ Erro ao executar seed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
