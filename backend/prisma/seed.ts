import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // seed categories
  const categories = [
    'Design & Creative', 'Tech & Dev', 'Writing & Translation',
    'Tutoring & Academic', 'Moving & Labour', 'Photography & Video',
    'Events & Hospitality', 'Admin & Errands'
  ]
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\W+/g, '-') }
    })
  }

  // seed super admin
  const hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD!, 12)
  await prisma.superAdmin.upsert({
    where: { email: process.env.SUPERADMIN_EMAIL! },
    update: {},
    create: {
      email: process.env.SUPERADMIN_EMAIL!,
      passwordHash: hash,
      fullName: 'Platform Admin',
    }
  })

  console.log('✅ Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())