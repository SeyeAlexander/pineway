import { Hono } from "hono";
import { handle } from "hono/vercel";
import profileRoutes from "../profile/profile.routes";

const app = new Hono().basePath("/actions").route("/profile", profileRoutes);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export const dynamic = "force-dynamic";
