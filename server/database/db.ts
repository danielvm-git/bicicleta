import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@dummy.neon.tech/neondb';
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
