import * as table from '$lib/server/db/schema';
import { error, type RequestHandler, text } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { eq } from 'drizzle-orm';
import * as queries from '$lib/server/db/queries';

export const DELETE: RequestHandler = async ({ locals, params }) => {
    const shortCode = params.shortCode;

    if (!shortCode) {
        return error(400, 'Short code is required');
    } else if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const deleted = await queries.deleteShortlink(shortCode);
        if (deleted) {
            return text('URL deleted successfully');
        }
        return error(404, 'URL not found');
    } catch (e) {
        console.error('Error deleting URL:', (e as Error).toString());
        return error(500, 'Failed to delete URL: ' + (e as Error).toString());
    }
};
