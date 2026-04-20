import Database from 'better-sqlite3';
import path from 'path';

// Points to your Generator.db in the /db folder
const dbPath = path.resolve('server/db/Generator.db');
const db = new Database(dbPath);

// Optional: log to confirm
console.log('✅ Connected to SQLite DB')

export default db;