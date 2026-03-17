import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const boards = pgTable("boards", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  title: text("title").notNull(),
  description: text("description"),
  color: text("color").default("bg-blue-500"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
})