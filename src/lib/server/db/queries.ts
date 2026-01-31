import { eq } from 'drizzle-orm';
import { db } from '.';
import * as table from './schema';

export async function checkIfOriginalUrlExists(originalUrl: string) {
    const [existing] = await db
        .select()
        .from(table.url)
        .where(eq(table.url.originalUrl, originalUrl))
        .limit(1);
    return existing || false;
}

export async function createShortlink(originalUrl: string, shortCode: string, userId?: string) {
    const id = crypto.randomUUID();
    // @ts-ignore
    const [result] = await db.insert(table.url).values({
        id,
        originalUrl,
        shortCode,
        userId: userId || null,
        createdAt: new Date()
    }).returning();
    return result;
}

export async function checkIfShortCodeExists(shortCode: string) {
    const [existing] = await db
        .select()
        .from(table.url)
        .where(eq(table.url.shortCode, shortCode))
        .limit(1);
    return existing || false;
}

export async function deleteShortlink(shortCode: string) {
    const [result] = await db
        .delete(table.url)
        .where(eq(table.url.shortCode, shortCode))
        .returning();
    return result;
}