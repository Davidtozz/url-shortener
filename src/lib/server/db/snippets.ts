import { eq } from "drizzle-orm";
import { db } from "$lib/server/db"
import { url } from "./schema";

export async function getUserUrls(userId: string) {
    return await db
    .select()
    .from(url)
    .where(eq(url.userId, userId))
}