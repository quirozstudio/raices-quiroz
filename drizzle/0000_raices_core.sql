CREATE TABLE `stories` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`prompt` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`privacy` text DEFAULT 'private' NOT NULL,
	`shared_with` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `memories` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`story_id` text,
	`name` text NOT NULL,
	`object_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`group_name` text DEFAULT 'Familia' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_stories_owner_updated` ON `stories` (`owner_id`,`updated_at`);
--> statement-breakpoint
CREATE INDEX `idx_memories_owner_created` ON `memories` (`owner_id`,`created_at`);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_people_owner_email` ON `people` (`owner_id`,`email`);
--> statement-breakpoint
PRAGMA optimize;
