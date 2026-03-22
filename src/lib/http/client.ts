import { hcWithType } from "./";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error(`Please set the "NEXT_PUBLIC_SITE_URL" variable`);
}

export const httpClient = hcWithType(siteUrl, {
  init: {
    credentials: "include",
  },
});
