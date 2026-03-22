import { cookies } from "next/headers";
import { hcWithType } from ".";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  throw new Error(`Please set the "NEXT_PUBLIC_SITE_URL" variable`);
}

// Server-side httpClient with cookies
export async function getServerHttpClient() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return hcWithType(siteUrl!, {
    headers: {
      Cookie: cookieHeader,
    },
  });
}
