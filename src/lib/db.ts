import { Pool } from 'pg';

const pool = new Pool({
  host: 'dpg-d0sgass9c44c73f5avb0-a.oregon-postgres.render.com',
  port: 5432,
  user: 'elton',
  password: 'AVK75DrHO6FujUEOsb9woeigmaJBAloy',
  database: 'painelgerencial',
  ssl: {
    rejectUnauthorized: false, // Importante para SSL do Render
  },
});

export default pool;



