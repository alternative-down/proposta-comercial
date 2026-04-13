// Use require to avoid static analysis executing DB at build time
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Database = require('better-sqlite3');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { drizzle } = require('drizzle-orm/better-sqlite3');
import * as schema from '@/db/schema';

const path = process.env.DATABASE_URL || './data/fatura-express.db';
const sqlite = new Database(path);
export const db = drizzle(sqlite, { schema });
