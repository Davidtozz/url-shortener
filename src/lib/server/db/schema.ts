import { pgTable, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: uuid('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').notNull().references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const url = pgTable('url', {
	id: uuid('id').primaryKey(),
	originalUrl: text('original_url').notNull(),
	shortCode: text('short_code').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	userId: uuid('user_id').notNull().references(() => user.id), // Null means it was created by a guest
	clicks: integer('clicks').notNull().default(0)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type URL = typeof url.$inferSelect;