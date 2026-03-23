"use server";

import { ErrorCode } from "@/lib/errors";
import { Result, captureAndReturnError, failure, success } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { numbers } from "nanoid-dictionary";
import { createDrizzleSupabaseClient, db as dbWithoutRLS } from "~/db";
import type { Profile, UpdateProfile } from "~/db/schema/profiles";
import { profilesTable } from "~/db/schema/profiles";

const nanoid = customAlphabet(numbers, 6);

export async function createProfile(userId: string): Promise<Result<Profile>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user?.email || error) {
      return failure({
        code: ErrorCode.UNAUTHORIZED,
        message: "User not authenticated",
        userMessage: "You must be logged in to create a profile.",
      });
    }

    const email = user.email;
    const localPart = email.split("@")[0];
    const username = localPart.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const randomizedUsername = `${username}_${nanoid()}`;

    const [profile] = await dbWithoutRLS
      .insert(profilesTable)
      .values({ userId, username: randomizedUsername })
      .returning();

    return success(profile);
  } catch (error) {
    return captureAndReturnError({
      code: ErrorCode.DATABASE_ERROR,
      message: "Failed to create profile",
      userMessage: "We couldn't set up your profile. Please try again.",
      originalError: error,
    });
  }
}

export async function getUserProfile(): Promise<Result<Profile & { email?: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return failure({
        code: ErrorCode.UNAUTHORIZED,
        message: "User not authenticated",
        userMessage: "You must be logged in to view your profile.",
      });
    }

    const { rls } = await createDrizzleSupabaseClient();

    const [profile] = await rls((tx) =>
      tx
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.userId, user.id)),
    );

    if (!profile) {
      return failure({
        code: ErrorCode.NOT_FOUND,
        message: "Profile not found",
        userMessage: "We couldn't find your profile.",
      });
    }

    return success({
      ...profile,
      email: user.email,
    });
  } catch (error) {
    return captureAndReturnError({
      code: ErrorCode.DATABASE_ERROR,
      message: "Failed to fetch profile",
      userMessage: "We couldn't load your profile. Please try again.",
      originalError: error,
    });
  }
}

export async function getPublicUserProfile(
  username: string,
): Promise<Result<Omit<Profile, "note">>> {
  try {
    const [profile] = await dbWithoutRLS
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.username, username));

    if (!profile) {
      return failure({
        code: ErrorCode.NOT_FOUND,
        message: "Profile not found",
        userMessage: "This profile doesn't exist.",
      });
    }

    // Strip the private note before returning
    const { note: _note, ...publicProfile } = profile;

    return success(publicProfile);
  } catch (error) {
    return captureAndReturnError({
      code: ErrorCode.DATABASE_ERROR,
      message: "Failed to fetch public profile",
      userMessage: "We couldn't load this profile. Please try again.",
      originalError: error,
    });
  }
}

export async function updateUserProfile(
  data: UpdateProfile,
): Promise<Result<Profile>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return failure({
        code: ErrorCode.UNAUTHORIZED,
        message: "User not authenticated",
        userMessage: "You must be logged in to update your profile.",
      });
    }

    const [existingProfile] = await dbWithoutRLS
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, user.id));

    if (!existingProfile) {
      return failure({
        code: ErrorCode.NOT_FOUND,
        message: "Profile not found",
        userMessage: "We couldn't find the profile to update.",
      });
    }

    if (data.username && data.username !== existingProfile.username) {
      if (existingProfile.usernameUpdatedAt) {
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        if (new Date(existingProfile.usernameUpdatedAt) > fourteenDaysAgo) {
          return failure({
            code: ErrorCode.VALIDATION_ERROR,
            userMessage: "You can only change your username once every 14 days.",
            message: "Username update restricted by 14-day cooldown.",
          });
        }
      }
      data.usernameUpdatedAt = new Date();
    }

    const { rls } = await createDrizzleSupabaseClient();

    const [profile] = await rls((tx) =>
      tx
        .update(profilesTable)
        .set(data)
        .where(eq(profilesTable.userId, user.id))
        .returning(),
    );

    return success(profile);
  } catch (error) {
    return captureAndReturnError({
      code: ErrorCode.DATABASE_ERROR,
      message: "Failed to update profile",
      userMessage: "We couldn't update your profile. Please try again.",
      originalError: error,
    });
  }
}
