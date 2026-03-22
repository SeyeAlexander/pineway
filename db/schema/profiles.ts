import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { foreignKey, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const profilesTable = pgTable(
  "profiles",
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: uuid().notNull().unique(),
    username: text().notNull().unique(),
    avatarUrl: text(),
    bio: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [authUsers.id],
    }).onDelete("cascade"),
  ],
);

export type Profile = InferSelectModel<typeof profilesTable>;
export type CreateProfile = InferInsertModel<typeof profilesTable>;
export type UpdateProfile = Omit<Partial<CreateProfile>, "userId" | "id">;
