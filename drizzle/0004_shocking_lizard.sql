ALTER TABLE "chats" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "read_at" timestamp;