import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  timestamp,
  text,
  uuid,
  serial,
} from "drizzle-orm/pg-core";

export const tickets = pgTable("tickets", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  idNumber: text("idNumber").notNull(),
  numbers: integer("numbers").array().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  roundId: integer("roundId").references(() => rounds.id),
});

export const rounds = pgTable("rounds", {
  id: serial("id").primaryKey(),
  drawnNumbers: integer("drawnNumbers").array(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  closedAt: timestamp("closedAt"),
});

export const ticketsRelations = relations(tickets, ({ one }) => ({
  rounds: one(rounds, {
    fields: [tickets.roundId],
    references: [rounds.id],
  }),
}));

export const roundsRelations = relations(rounds, ({ many }) => ({
  tickets: many(tickets),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
