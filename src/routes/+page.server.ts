import { db } from "$lib/server/db"
import { url, user } from "$lib/server/db/schema"
import { getUserUrls } from "$lib/server/db/snippets"
import type { PageServerLoad } from "./$types"
import { eq } from "drizzle-orm"

export const load: PageServerLoad = async ({locals}) => {

    if(!locals.user) {
        return {
            user: null,
            links: []
        };
    }

    return {
        user: locals.user.username,
        links: await getUserUrls(locals.user.id)
    }
}