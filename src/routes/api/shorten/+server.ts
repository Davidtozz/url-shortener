import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { url } from '$lib/server/db/schema';

function generateShortCode(): string {
    return Math.random().toString(36).substring(2, 10);
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { originalUrl } = await request.json();

        if (!originalUrl) {
            return json(
                { error: 'Original URL is required' },
                { status: 400 }
            );
        }

        // Validate URL
        try {
            new URL(originalUrl);
        } catch {
            return json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Generate a short code
        const shortCode = generateShortCode();
        const id = Math.random().toString(36).substring(2, 15);

        // Create the shortened URL record
        const result = await db.insert(url).values({
            id,
            originalUrl,
            shortCode,
            createdAt: new Date()
        }).returning();

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
