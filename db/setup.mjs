// Applies db/schema.sql then db/seed.sql to the Neon database, then prints the rows.
// Run it with:  npm run db:setup
import { readFileSync } from "node:fs";
import { Client, neonConfig } from "@neondatabase/serverless";

// The Neon driver speaks over a WebSocket; modern Node provides one built in.
neonConfig.webSocketConstructor = globalThis.WebSocket;

const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
const seed = readFileSync(new URL("./seed.sql", import.meta.url), "utf8");

// The .sql files contain many statements; the driver executes them one at a time,
// so split on semicolons (none of our files use ; inside a statement).
const statements = `${schema}\n${seed}`
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

for (const statement of statements) {
  try {
    await client.query(statement);
  } catch (err) {
    // 42P07 = "relation already exists" — the schema was applied on a previous run.
    if (err.code === "42P07") {
      console.log("(table already exists — skipping)");
      continue;
    }
    throw err;
  }
}

// Show what is actually in the database right now.
const restaurants = await client.query("SELECT * FROM restaurants ORDER BY id");
const reviews = await client.query("SELECT * FROM reviews ORDER BY id");
console.log("=== restaurants ===");
console.table(restaurants.rows);
console.log("=== reviews ===");
console.table(reviews.rows);

await client.end();
