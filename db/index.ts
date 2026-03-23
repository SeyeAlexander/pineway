import { ErrorCode } from "@/lib/errors";
import { captureAndReturnError } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";
import { sql } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(`Please set the "DATABASE_URL" variable`);
}

// In development, Next.js HMR clears the module cache and re-imports index.ts. 
// Spawning a new Postgres client and connection pool on every save leads to connection exhaustion and hanging.
const globalForPostgres = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = globalForPostgres.postgresClient ?? postgres(dbUrl, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresClient = client;
}

export const db = drizzle({ client });

type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

export function createDrizzle<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Database extends PgDatabase<any, any, any>,
  Token extends SupabaseToken = SupabaseToken,
>(token: Token, { client }: { client: Database }) {
  return {
    rls: (async (transaction, ...rest) => {
      return await client.transaction(
        async (tx) => {
          // Supabase exposes auth.uid() and auth.jwt()
          // https://supabase.com/docs/guides/database/postgres/row-level-security#helper-functions
          let transactionSucceeded = false;
          try {
            // -- auth.jwt()
            await tx.execute(
              sql`select set_config('request.jwt.claims', ${JSON.stringify(token)}, TRUE)`,
            );
            // -- auth.uid()
            await tx.execute(
              sql`select set_config('request.jwt.claim.sub', ${token.sub ?? ""}, TRUE)`,
            );
            // -- set local role
            await tx.execute(
              sql`set local role ${sql.raw(token.role ?? "anon")}`,
            );
            const result = await transaction(tx);
            transactionSucceeded = true;
            return result;
          } catch (error) {
            captureAndReturnError({
              code: ErrorCode.DATABASE_ERROR,
              message: "Database transaction failed",
              originalError: error,
            });
            throw error;
          } finally {
            if (transactionSucceeded) {
              await tx.execute(sql`
            -- reset
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
            `);
            }
          }
        },
        ...rest,
      );
    }) as typeof client.transaction,
  };
}

export async function createDrizzleSupabaseClient() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return createDrizzle(user ? user : { role: "anon" }, { client: db });
}
