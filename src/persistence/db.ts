import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

// Open or create the SQLite database
const sqliteDb = SQLite.openDatabaseSync("photoeffects.db");

// Create Drizzle ORM instance
const db = drizzle(sqliteDb, { logger: true });

export default db;
