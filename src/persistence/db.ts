import { drizzle } from "drizzle-orm/expo-sqlite";
import { Logger } from "drizzle-orm/logger";
import * as SQLite from "expo-sqlite";
import * as schema from "./schema";

// Open or create the SQLite database
const sqliteDb = SQLite.openDatabaseSync("photoeffects.db");

class QueryLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

// Create Drizzle ORM instance
const db = drizzle(sqliteDb, { schema, logger: new QueryLogger() });

export default db;
