import { pgTable, integer, timestamp, text, uuid } from "drizzle-orm/pg-core";

export const tickets = pgTable("tickets", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  idNumber: text("idNumber").notNull(), // OIB ili Broj putovnice
  numbers: integer("numbers").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
