require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function reset() {
  const client = await pool.connect()
  try {
    console.log('\u26A0\uFE0F  Dropping all tables...')
    await client.query(`
      DROP TABLE IF EXISTS
        audit_logs,
        messages,
        reviews,
        applications,
        gigs,
        categories,
        super_admins,
        verifications,
        accounts,
        sessions,
        users,
        _migrations
      CASCADE
    `)
    console.log('\u2705 All tables dropped')
    console.log('Run npm run db:migrate && npm run db:seed to rebuild')
  } finally {
    client.release()
    await pool.end()
  }
}

reset().catch(err => {
  console.error('Reset failed:', err)
  process.exit(1)
})
