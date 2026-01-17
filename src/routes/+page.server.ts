import { hash, verify } from '@node-rs/argon2';
import { fail, invalid, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {

    if(!locals.user) {
        return {
            user: null,
            session: null,
            links: []
        };
    }

    const userLinks = await db
        .select()
        .from(table.url)
        .where(eq(table.url.userId, locals.user.id))
        .orderBy(table.url.createdAt);

    return {
        user: locals.user,
        session: locals.session,
        links: userLinks
    };
};

export const actions: Actions = {
    login: async ({ request, cookies, locals }) => {
        if (locals.user) return invalid('Already logged in');

        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username (min 3, max 31 characters, alphanumeric only)' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
        }

        const results = await db.select().from(table.user).where(eq(table.user.username, username));
        const existingUser = results.at(0);
        if (!existingUser) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        if (!validPassword) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        const session = await auth.createSession(existingUser.id);
        auth.setSessionTokenCookie(cookies, session.id, session.expiresAt);

        return redirect(302, '/');
    },

    register: async ({ cookies, request, locals }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password' });
        }

        const userId = crypto.randomUUID();
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        try {
            await db.insert(table.user).values({ id: userId, username, passwordHash });

            const session = await auth.createSession(userId);
            auth.setSessionTokenCookie(cookies, session.id, session.expiresAt);
        } catch {
            return fail(500, { message: 'An error has occurred' });
        }

        return { user: locals.user, session: locals.session };
    },

    logout: async ({ locals, cookies }) => {
        if (locals.session) {
            await auth.invalidateSession(locals.session.id);
            auth.deleteSessionTokenCookie(cookies);
        }

        return { user: null, session: null };
    }
};

function validateUsername(username: unknown): username is string {
    return typeof username === 'string' && username.length >= 3 && username.length <= 31 && /^[a-z0-9_-]+$/.test(username);
}

function validatePassword(password: unknown): password is string {
    return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}