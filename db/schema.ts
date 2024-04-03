import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  createdAt: text('createdAt').default(sql`(CURRENT_TIMESTAMP)`),
  email: text('email').unique().notNull(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  imgUrl: text('imgUrl').notNull(),
});
