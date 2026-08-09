import pg from "pg";
import "dotenv/config";

export const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://icpc:icpc_local_dev@localhost:5432/icpc_squad_finder",
});
