import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/index';
import { url } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    const shortCode = params.shorturl;

    // Check for the existence of the provided URL in the DBMS
    const result = await db
        .select()
        .from(url)
        .where(eq(url.shortCode, shortCode))
        .limit(1);

     
  
    if (!result.length) {
        // Short URL not found
        throw error(404, 'Short URL not found');
    }

    const urlRecord = result[0];

    // Update click count
    await db
        .update(url)
        .set({ clicks: urlRecord.clicks + 1 })
        .where(eq(url.id, urlRecord.id));

    // Redirect to the original URL
    throw redirect(301, urlRecord.originalUrl);
};
