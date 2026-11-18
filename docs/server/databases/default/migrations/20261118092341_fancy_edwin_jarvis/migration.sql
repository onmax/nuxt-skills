CREATE TABLE `vitehub_content_sessions` (
	`workspace` text NOT NULL,
	`collection` text NOT NULL,
	`document` text NOT NULL,
	`session` text NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text,
	`user_image` text,
	`kind` text NOT NULL,
	`acquired_at` integer,
	`renewed_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`last_input_at` integer,
	CONSTRAINT `vitehub_content_sessions_pk` PRIMARY KEY(`workspace`, `collection`, `document`, `session`)
);
--> statement-breakpoint
CREATE INDEX `vitehub_content_sessions_expiry` ON `vitehub_content_sessions` (`workspace`,`expires_at`);