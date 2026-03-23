import { Avatar } from "@/components/ui/avatar/avatar";
import Image from "next/image";
import pinewayLogoMark from "~/public/pineway-logo-mark.svg";
import Link from "next/link";

import { getPublicUserProfile, getUserProfile } from "@/app/actions/profile/profile.service";
import { notFound } from "next/navigation";
import { FloatingHeader } from "./floating-header";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Strip the leading @ if present (URL is /@username)
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  const result = await getPublicUserProfile(cleanUsername);

  if (!result.success || !result.data) {
    return (
      <div
        className='flex items-center justify-center bg-white shadow-card-subtle rounded-3xl m-2 py-10'
        style={{ minHeight: "calc(100vh - 1rem)" }}
      >
        <div className='w-full max-w-lg bg-white overflow-hidden flex flex-col h-full items-center justify-center'>
          <h1 className='text-xl text-zinc-900 font-medium'>Profile not found</h1>
          <p className='text-sm text-gray-500 mt-2 text-center px-6'>
            {!result.success ? result.error.userMessage : "This profile doesn't exist."}
          </p>
        </div>
      </div>
    );
  }
  const profile = result.data;
  
  const myProfileResult = await getUserProfile();
  const loggedInUser = myProfileResult.success ? myProfileResult.data : null;

  return (
    <>
      {loggedInUser && <FloatingHeader username={loggedInUser.username} />}
      <div
      className='flex items-start justify-center bg-white shadow-card-subtle rounded-3xl m-2 py-10'
      style={{ minHeight: "calc(100vh - 1rem)" }}
    >
      <div className='w-full max-w-lg'>
        <div
          className='rounded-3xl bg-white overflow-hidden'
          style={{
            boxShadow: `
              0px 0px 0px 1px rgba(120, 57, 238, 0.08),
              0px 2px 24px 0px rgba(120, 57, 238, 0.06),
              0px 4px 4px 0px rgba(0, 0, 0, 0.01),
              0px 2px 2px 0px rgba(0, 0, 0, 0.01)
            `,
          }}
        >
          <div className='p-8'>
            {/* Name + Avatar */}
            <div className='flex items-start justify-between'>
              <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {profile.name || profile.username}
                </h1>
                <span className='text-sm text-gray-500'>@{profile.username}</span>
              </div>
              <div className='flex-shrink-0 ml-6'>
                {/* Subtle violet ring — forced square aspect ratio for perfect circle */}
                <div
                  className='rounded-full aspect-square flex items-center justify-center'
                  style={{
                    padding: "2.5px",
                    background:
                      "linear-gradient(135deg, rgba(120, 57, 238, 0.7), rgba(135, 91, 247, 0.7))",
                  }}
                >
                  <div className='rounded-full aspect-square bg-white p-[2px] flex items-center justify-center'>
                    <Avatar src={profile.avatarUrl ?? ""} type='circular' size='64' />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <>
                <hr className='my-6 border-gray-100' />
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs font-medium uppercase tracking-wider text-gray-400'>
                    About
                  </span>
                  <p className='text-sm leading-relaxed text-gray-700'>{profile.bio}</p>
                </div>
              </>
            )}

            {/* Profile link */}
            <hr className='my-6 border-gray-100' />
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium uppercase tracking-wider text-gray-400'>
                Pineway Profile
              </span>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-600 font-medium'>
                <span className='h-1.5 w-1.5 rounded-full bg-violet-400' />
                pineway.io/{profile.username}
              </span>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        {loggedInUser ? (
          <div className='mt-10 flex w-full items-center justify-center gap-2'>
            <span className='text-xs text-gray-400'>Powered by</span>

            <span>
              <Image
                src={pinewayLogoMark}
                width={20}
                height={20}
                alt='Pineway logo mark'
                className='mx-auto'
              />
            </span>
          </div>
        ) : (
          <Link href="/login" className='mt-10 flex w-full items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer'>
            <span className='text-xs text-gray-400'>Powered by</span>

            <span>
              <Image
                src={pinewayLogoMark}
                width={20}
                height={20}
                alt='Pineway logo mark'
                className='mx-auto'
              />
            </span>
          </Link>
        )}
      </div>
    </div>
    </>
  );
}
