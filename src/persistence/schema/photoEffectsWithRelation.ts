import { relations } from "drizzle-orm";
import photoEffects from "./photoEffects";
import photos from "./photos";

const photoEffectsWithRelations = relations(photoEffects, ({ one }) => ({
  photo: one(photos, {
    fields: [photoEffects.photoId],
    references: [photos.id],
  }),
}));

export default photoEffectsWithRelations;
