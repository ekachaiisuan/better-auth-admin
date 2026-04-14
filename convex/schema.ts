import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_auth', ['authId']),
  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id('users'),
    joinCode: v.string(),
  }),
});
