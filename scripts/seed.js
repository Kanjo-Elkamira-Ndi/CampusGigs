require('dotenv').config()
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function seed() {
  const client = await pool.connect()
  try {
    console.log('\uD83C\uDF31 Seeding categories...')

    const categories = [
      { name: 'Admin & Errands',        slug: 'admin-errands',        icon: 'clipboard' },
      { name: 'Design & Creative',      slug: 'design-creative',      icon: 'palette' },
      { name: 'Events & Hospitality',   slug: 'events-hospitality',   icon: 'calendar' },
      { name: 'Moving & Labour',        slug: 'moving-labour',        icon: 'truck' },
      { name: 'Photography & Video',    slug: 'photography-video',    icon: 'camera' },
      { name: 'Tech & Dev',             slug: 'tech-dev',             icon: 'code' },
      { name: 'Tutoring & Academic',    slug: 'tutoring-academic',    icon: 'book' },
      { name: 'Writing & Translation',  slug: 'writing-translation',  icon: 'pen' },
    ]

    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (name, slug, icon_name)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug) DO NOTHING
      `, [cat.name, cat.slug, cat.icon])
    }
    console.log('\u2705 Categories seeded (8)')

    console.log('\uD83C\uDF31 Seeding super admin...')
    const hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 12)
    await client.query(`
      INSERT INTO super_admins (email, password_hash, full_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO NOTHING
    `, [process.env.SUPERADMIN_EMAIL, hash, 'Platform Admin'])
    console.log('\u2705 Super admin seeded')

    console.log('\n\uD83C\uDF89 Seed complete')
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
