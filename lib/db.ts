import { neon } from "@neondatabase/serverless";

// The single place in this app that knows how to reach the database.
// `sql` is a function: you hand it a query, it hands you back rows.
export const sql = neon(process.env.DATABASE_URL ?? "");
