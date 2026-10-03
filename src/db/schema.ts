import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type ChallengeExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type ChallengeTestCase = {
  name: string;
  code: string;
};

export const DIFFICULTIES = ["easy", "medium", "hard", "expert"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    difficulty: text("difficulty").notNull().default("easy"),
    language: text("language").notNull().default("TypeScript"),
    xp: integer("xp").notNull().default(50),
    estimatedMinutes: integer("estimated_minutes").notNull().default(15),
    tags: jsonb("tags")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    constraints: jsonb("constraints")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    examples: jsonb("examples")
      .$type<ChallengeExample[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    starterCode: text("starter_code").notNull().default(""),
    expectedTokens: jsonb("expected_tokens")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    testCases: jsonb("test_cases")
      .$type<ChallengeTestCase[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    publishDate: date("publish_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("challenges_publish_date_idx").on(t.publishDate),
    index("challenges_language_idx").on(t.language),
    index("challenges_difficulty_idx").on(t.difficulty),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    status: text("status").notNull().default("pending"),
    passedTests: integer("passed_tests").notNull().default(0),
    totalTests: integer("total_tests").notNull().default(0),
    xpAwarded: integer("xp_awarded").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("submissions_challenge_idx").on(t.challengeId)],
);

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
