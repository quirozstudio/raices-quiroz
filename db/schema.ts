import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const stories = sqliteTable("stories", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  prompt: text("prompt"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  privacy: text("privacy", { enum: ["private", "people", "link"] }).notNull().default("private"),
  sharedWith: text("shared_with").notNull().default("[]"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const memories = sqliteTable("memories", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  storyId: text("story_id"),
  name: text("name").notNull(),
  objectKey: text("object_key").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const people = sqliteTable("people", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  groupName: text("group_name").notNull().default("Familia"),
  createdAt: integer("created_at").notNull(),
});
