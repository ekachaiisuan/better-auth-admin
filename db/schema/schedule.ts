import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  integer,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const boards = pgTable(
  'boards',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    }).defaultNow().notNull(),
    title: text('title').notNull(),
    description: text('description'),
    color: text('color').default('bg-blue-500'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('boards_user_id_idx').on(table.userId)],
);

export const columns = pgTable(
  'columns',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    boardId: uuid('board_id')
      .notNull()
      .references(() => boards.id, {
        onDelete: 'cascade',
      }),
    title: text('title').notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index('columns_board_id_idx').on(table.boardId),
    index('columns_user_id_idx').on(table.userId),
    index('columns_board_sort_idx').on(table.boardId, table.sortOrder),
  ],
);

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    title: text('title').notNull(),
    description: text('description'),
    assignee: text('assignee'),
    dueDate: date('due_date'),
    columnId: uuid('column_id')
      .notNull()
      .references(() => columns.id, {
        onDelete: 'cascade',
      }),
    priority: priorityEnum('priority').default('medium'),
    sortOrder: integer('sort_order').default(0).notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('tasks_column_id_idx').on(table.columnId)],
);

export type ColumnWithTasks = typeof columns.$inferSelect & {
  tasks: typeof tasks.$inferSelect[];
};

export type Board = typeof boards.$inferSelect;
export type Column = typeof columns.$inferSelect;
export type Task = typeof tasks.$inferSelect;
