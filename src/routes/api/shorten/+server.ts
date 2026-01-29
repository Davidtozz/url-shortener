import { invalid, json, text } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import * as queries from '$lib/server/db/queries';

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
        
        const existing = await queries.checkIfOriginalUrlExists(originalUrl);

        if(existing) {
            return json({
                success: true,
                shortCode: existing.shortCode,
                originalUrl: existing.originalUrl,
                shortUrl: `${new URL(request.url).origin}/${existing.shortCode}`
            });
        }

        // Generate a short code
        const shortCode = generateShortCode();        
        const shortlinkResult = await queries.createShortlink(originalUrl, shortCode, locals.user?.id);

        return json({
            success: true,
            shortCode: shortlinkResult.shortCode,
            originalUrl: shortlinkResult.originalUrl,
            shortUrl: `${new URL(request.url).origin}/${shortlinkResult.shortCode}`
        });
    } catch (error) {
        console.error('Error shortening URL:', error);
        return json(
            { error: 'Failed to shorten URL' },
            { status: 500 }
        );
    }
};
