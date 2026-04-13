import {
  foreignKey,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import photos from "./photos";

const photoEffects = sqliteTable(
  "photo_effects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    order: integer("order").notNull(),
    effectName: text("effect_name").notNull(),
    effectOptions: text("effect_options_json"),
    photoId: integer("photo_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.photoId],
      foreignColumns: [photos.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export default photoEffects;

export type PhotoEffectEntity = typeof photoEffects.$inferSelect;
export type PhotoEffect = typeof photoEffects.$inferInsert;
