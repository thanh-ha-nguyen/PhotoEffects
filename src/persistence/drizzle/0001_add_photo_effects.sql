CREATE TABLE `photo_effects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`effect_name` text NOT NULL,
	`effect_options_json` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`photo_id` integer NOT NULL,
	FOREIGN KEY (`photo_id`) REFERENCES `photos`(`id`) ON UPDATE cascade ON DELETE cascade
);
