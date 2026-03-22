import { validate } from "@/lib/http/validate";
import { Hono } from "hono";
import z from "zod";
import { UpdateProfile } from "~/db/schema/profiles";
import { createProfile, updateUserProfile } from "./profile.service";

const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
}) satisfies z.ZodType<UpdateProfile>;

const profileRoutes = new Hono()
  // POST /profile
  .post("/", validate("json", z.object({ userId: z.string() })), async (c) => {
    const { userId } = c.req.valid("json");
    const result = await createProfile(userId);
    return c.json(result);
  })
  // PATCH /profile/:profileId
  .patch("/", validate("json", UpdateProfileSchema), async (c) => {
    const profile = c.req.valid("json");
    const result = await updateUserProfile(profile);
    return c.json(result);
  })
  // GET /profile
  .get("/", async (c) => {
    // @todo implement
    return c.json({
      message: "Not yet implemented",
    });
  })
  // GET /profile/:username
  .get("/:username", async (c) => {
    return c.json({
      message: "Not yet implemented",
    });
  });

export default profileRoutes;
