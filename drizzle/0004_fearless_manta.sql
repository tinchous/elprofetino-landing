ALTER TABLE `assignments` MODIFY COLUMN `completedAt` timestamp DEFAULT null;--> statement-breakpoint
ALTER TABLE `exams` MODIFY COLUMN `completedAt` timestamp DEFAULT null;