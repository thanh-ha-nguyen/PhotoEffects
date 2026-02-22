import { eq, sql } from "drizzle-orm";
import db from "./db";
import { Photo, photos } from "./schema";

export async function savePhoto(...values: Photo[]) {
  return await db
    .insert(photos)
    .values(
      values.map((value) => ({ ...value, createdAt: sql`CURRENT_TIMESTAMP` })),
    )
    .returning();
}

export async function getAllPhotos() {
  return db.select().from(photos).all();
}

export async function getPhotoById(id: number) {
  return db.query.photos.findFirst({
    with: { effects: true },
    where: eq(photos.id, id),
  });
}
