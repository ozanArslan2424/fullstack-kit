CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`passwordHash` text NOT NULL,
	`emailVerified` integer,
	`locked` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text,
	`about` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`userEmail` text NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`type` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer
);
