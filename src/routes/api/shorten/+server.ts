import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

function generateShortCode(): string {
    return Math.random().toString(36).substring(2, 10);
}

export const POST: RequestHandler = async ({ request, locals }) => {
    const { originalUrl } = await request.json();
    
    if (!originalUrl) {
        return json(
                { error: 'Original URL is required' },
                { status: 400 }
            );
        }
    try {
        
        // Validate URL
        try {
            new URL(originalUrl);
        } catch {
            return json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }
        
        const [existing] = await db
            .select()
            .from(table.url)
            .where(eq(table.url.originalUrl, originalUrl))
            .limit(1);

        if(existing) {
            return json({
                success: true,
                shortCode: existing.shortCode,
                shortUrl: `${new URL(request.url).origin}/${existing.shortCode}`
            });
        }

        // Generate a short code
        const shortCode = generateShortCode();
        const id = crypto.randomUUID(); 
        
        let result; 
        
        if(locals.user) {
            //@ts-ignore
            result = await db.insert(table.url).values({
                id,
                originalUrl,
                userId: locals.user.id,
                shortCode,
                createdAt: new Date()
            }).returning();
        } else {
            //@ts-ignore
            result = await db.insert(table.url).values({
                id,
                originalUrl,
                userId: null,
                shortCode,
                createdAt: new Date()
            }).returning();
        }
        return json({
            success: true,
            shortCode: result[0].shortCode,
            shortUrl: `${new URL(request.url).origin}/${result[0].shortCode}`
        });
    } catch (error) {
        console.error('Error shortening URL:', error);
        return json(
            { error: 'Failed to shorten URL' },
            { status: 500 }
        );
    }
};
