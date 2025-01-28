import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/neon-http";
import { Pool } from "pg";
import * as schema from "./schema";

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// });

// const db = drizzle(pool, { schema });
const db = drizzle(process.env.DATABASE_URL as string, { schema });

export default db;
