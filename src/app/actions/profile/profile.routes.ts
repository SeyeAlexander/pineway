import { validate } from "@/lib/http/validate";
import { Hono } from "hono";
import z from "zod";
import { UpdateProfile } from "~/db/schema/profiles";
import {
  createProfile,
  getPublicUserProfile,
  getUserProfile,
  updateUserProfile,
} from "./profile.service";

const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  name: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
}) satisfies z.ZodType<UpdateProfile>;

const profileRoutes = new Hono()
  // POST /profile
  .post("/", validate("json", z.object({ userId: z.string() })), async (c) => {
    const { userId } = c.req.valid("json");
    const result = await createProfile(userId);
    return c.json(result);
  })
  // PATCH /profile
  .patch("/", validate("json", UpdateProfileSchema), async (c) => {
    const profile = c.req.valid("json");
    const result = await updateUserProfile(profile);
    return c.json(result);
  })
  // GET /profile — authenticated user's own profile
  .get("/", async (c) => {
    const result = await getUserProfile();
    return c.json(result);
  })
  // GET /profile/:username — public profile by username
  .get("/:username", async (c) => {
    const username = c.req.param("username");
    const result = await getPublicUserProfile(username);
    return c.json(result);
  });

export default profileRoutes;
