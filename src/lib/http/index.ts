import { AppType } from "@/app/actions/[[...routes]]/route";
import { hc } from "hono/client";

export type AppHttpClient = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): AppHttpClient =>
  hc<AppType>(...args);
