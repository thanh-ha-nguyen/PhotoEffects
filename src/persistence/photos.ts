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

export async function insertPhotoEffectsByPhotoId(
  photoId: number,
  ...values: Omit<PhotoEffect, "photoId">[]
) {
  return await db
    .insert(photoEffects)
    .values(
      values.map((value) => ({
        ...value,
        photoId,
        createdAt: sql`CURRENT_TIMESTAMP`,
      })),
    )
    .returning();
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

export async function getPhotoEffectsByPhotoId(photoId: number) {
  return await db
    .select()
    .from(photoEffects)
    .where(eq(photoEffects.photoId, photoId));
}
