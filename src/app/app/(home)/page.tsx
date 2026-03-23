import { getUserProfile, createProfile } from "@/app/actions/profile/profile.service";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettingsForm } from "./profile-settings-form";

export default async function ProfileSettingsPage() {
  let result = await getUserProfile();

  // If the user is authenticated but missing a profile (e.g. they confirmed email outside the app or missed the signup step)
  if (!result.success && result.error.userMessage === "We couldn't find your profile.") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await createProfile(user.id);
      result = await getUserProfile(); // Refetch
    }
  }

  if (!result.success) {
    return (
      <div
        className='flex flex-col bg-white rounded-3xl m-2 pt-10 pb-8'
        style={{ 
          minHeight: "calc(100vh - 1rem)",
          boxShadow: `
            0px 0px 0px 1px rgba(120, 57, 238, 0.3),
            0px 2px 24px 0px rgba(120, 57, 238, 0.3),
            0px 8px 32px 0px rgba(120, 57, 238, 0.2),
            0px 4px 4px 0px rgba(0, 0, 0, 0.02)
          `
        }}
      >
        <div className='w-full max-w-[800px] mx-auto flex flex-col flex-1 items-center justify-center'>
          <h1 className='text-xl text-red-500'>Failed to load profile.</h1>
          <p className='text-sm text-gray-500 mt-2'>{result.error.userMessage}</p>
        </div>
      </div>
    );
  }

  return <ProfileSettingsForm initialProfile={result.data} />;
}
