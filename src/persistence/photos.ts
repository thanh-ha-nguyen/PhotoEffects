import { eq, sql } from "drizzle-orm";
import db from "./db";
import { Photo, PhotoEffect, photoEffects, photos } from "./schema";

export async function insertPhotos(...values: Photo[]) {
  return await db
    .insert(photos)
    .values(
      values.map((value) => ({ ...value, createdAt: sql`CURRENT_TIMESTAMP` })),
    )
    .returning();
}

export async function savePhotoEffectsByPhotoId(
  photoId: number,
  effects: Omit<PhotoEffect, "photoId">[],
) {
  await db.transaction(async (tx) => {
    const effectsToInsert = effects
      .filter((effect) => !effect.id)
      .map((effect) => ({
        ...effect,
        photoId,
        createdAt: sql`CURRENT_TIMESTAMP`,
      }));

    await tx.insert(photoEffects).values(effectsToInsert).execute();

    const effectsToUpdate = effects
      .filter((effect) => effect.id)
      .map((effect) => ({
        ...effect,
        photoId,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      }));

    await Promise.all(
      effectsToUpdate.map(
        async (effect) =>
          await tx
            .update(photoEffects)
            .set(effect)
            .where(eq(photoEffects.id, effect.id!))
            .execute(),
      ),
    );
  });
}

export async function getAllPhotos() {
  return db.select().from(photos).all();
}

export async function getPhotoById(id: number) {
  return db.query.photos.findFirst({
    with: { effects: { orderBy: (table) => table.order } },
    where: eq(photos.id, id),
  });
}
