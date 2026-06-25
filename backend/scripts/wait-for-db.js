const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const RETRY_INTERVAL = 1000;
const MAX_RETRIES = 60;

let attempts = 0;

async function wait() {
  const pool = new Pool({ connectionString: DATABASE_URL, connectionTimeoutMillis: 2000 });

  while (attempts < MAX_RETRIES) {
    attempts++;
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('PostgreSQL is ready.');
      await pool.end();
      return;
    } catch {
      console.log(`Waiting for PostgreSQL... (${attempts}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, RETRY_INTERVAL));
    }
  }

  console.error('Failed to connect to PostgreSQL after 60 seconds.');
  process.exit(1);
}

wait();
