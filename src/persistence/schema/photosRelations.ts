import { relations } from "drizzle-orm";
import photoEffects from "./photoEffects";
import photos from "./photos";

const photosRelations = relations(photos, ({ many }) => ({
  effects: many(photoEffects),
}));

export default photosRelations;
