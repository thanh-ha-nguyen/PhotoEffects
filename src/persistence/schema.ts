import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uri: text("uri").notNull(),
  mimeType: text("mime_type"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type PhotoEntity = typeof photos.$inferSelect;
export type Photo = Omit<typeof photos.$inferInsert, "createdAt">;
