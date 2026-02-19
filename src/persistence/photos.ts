import { sql } from "drizzle-orm";
import db from "./db";
import { Photo, photos as photosSchema } from "./schema";

export async function savePhoto(...photos: Photo[]) {
  return await db
    .insert(photosSchema)
    .values(
      photos.map((photo) => ({ ...photo, createdAt: sql`CURRENT_TIMESTAMP` })),
    )
    .returning();
}

export async function getAllPhotos() {
  return db.select().from(photosSchema).all();
}
