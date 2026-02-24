CREATE TABLE `examAnswers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`questionId` int NOT NULL,
	`studentAnswer` text,
	`isCorrect` int,
	`pointsEarned` int DEFAULT 0,
	`answeredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `examAnswers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `examQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`type` enum('multiple_choice','true_false','open_ended') NOT NULL,
	`question` text NOT NULL,
	`options` text,
	`correctAnswer` text NOT NULL,
	`points` int NOT NULL,
	`topic` varchar(200) NOT NULL,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `examQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `examResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` int NOT NULL,
	`studentId` int NOT NULL,
	`totalPoints` int NOT NULL,
	`pointsEarned` int NOT NULL,
	`percentage` int NOT NULL,
	`weakTopics` text,
	`recommendations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `examResults_id` PRIMARY KEY(`id`),
	CONSTRAINT `examResults_examId_unique` UNIQUE(`examId`)
);
--> statement-breakpoint
CREATE TABLE `exams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`topics` text NOT NULL,
	`duration` int NOT NULL,
	`difficulty` varchar(20) NOT NULL,
	`totalPoints` int NOT NULL,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`startedAt` timestamp NOT NULL,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `examAnswers` ADD CONSTRAINT `examAnswers_examId_exams_id_fk` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `examAnswers` ADD CONSTRAINT `examAnswers_questionId_examQuestions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `examQuestions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `examQuestions` ADD CONSTRAINT `examQuestions_examId_exams_id_fk` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `examResults` ADD CONSTRAINT `examResults_examId_exams_id_fk` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `examResults` ADD CONSTRAINT `examResults_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exams` ADD CONSTRAINT `exams_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE no action ON UPDATE no action;