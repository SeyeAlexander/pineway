"use client";

import { Avatar } from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button/button";
import { HelperText } from "@/components/ui/helper-text/helper-text";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { showToast } from "@/components/ui/toast/toast";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProfile, useUpdateProfile } from "./hooks";
import type { UpdateProfile, Profile } from "~/db/schema/profiles";

const profileFormSchema = z.object({
  name: z
    .string()
    .max(50, "Name must be 50 characters or less")
    .regex(/^[a-zA-Z\s'-]*$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional().or(z.literal("")),
  note: z.string().max(500, "Note must be 500 characters or less").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettingsForm({
  initialProfile,
}: {
  initialProfile: Profile & { email?: string };
}) {
  const { data: profile } = useProfile(initialProfile);
  const { mutateAsync: updateProfileServer } = useUpdateProfile();

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const updateProfile = async (data: UpdateProfile) => {
    setSaveState("saving");
    try {
      await updateProfileServer(data);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
      return profile;
    } catch (e) {
      setSaveState("idle");
      throw e;
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  const currentAvatarUrl = localAvatarUrl ?? profile?.avatarUrl ?? null;
  const userEmail = profile?.email ?? "";

  const form = useForm<ProfileFormValues>({
    values: profile
      ? {
          name: profile.name ?? "",
          username: profile.username ?? "",
          bio: profile.bio ?? "",
          note: profile.note ?? "",
        }
      : undefined,
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      note: "",
    },
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  const { errors } = form.formState;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File too large",
        description: "Select an image smaller than 5MB.",
      });
      return;
    }

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const filePath = `${profile.userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      showToast({
        type: "error",
        title: "Upload failed",
        description: uploadError.message,
      });
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    setLocalAvatarUrl(publicUrl);

    await updateProfile({ avatarUrl: publicUrl });

    showToast({
      type: "success",
      title: "Changes saved!",
      position: "bottom-right",
    });
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile(values);
      showToast({
        type: "success",
        title: "Changes saved!",
        position: "bottom-right",
      });
      form.reset(values);
    } catch (err) {
      showToast({
        type: "error",
        title: "Failed to save changes.",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const isDirty = form.formState.isDirty;
  const isValid = form.formState.isValid;
  const isSaving = saveState === "saving";
  const canSave = isDirty && isValid && !isSaving;

  return (
    <div
      className='flex flex-col bg-white shadow-card-subtle rounded-3xl m-2 pt-10 pb-8'
      style={{ minHeight: "calc(100vh - 1rem)" }}
    >
      <div className='w-full max-w-[800px] mx-auto flex flex-col flex-1'>
        <h1 className='mb-8 text-3xl font-medium leading-tight text-gray-900'>Profile settings</h1>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex w-full flex-col flex-1 justify-between'
        >
          {/* div a — form card */}
          <div className='rounded-3xl bg-white shadow-card-subtle'>
            <div className='p-8 space-y-8'>
              {/* Profile photo */}
              <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-sm font-medium text-gray-800'>Profile photo</span>
                  <span className='text-[13px] text-gray-500'>
                    The photo set here is global and will reflect on your Pineway page.
                  </span>
                </div>
                <div className='flex-shrink-0 ml-6'>
                  <button
                    type='button'
                    onClick={handleAvatarClick}
                    className='cursor-pointer rounded-full'
                  >
                    <Avatar
                      src={currentAvatarUrl ?? ""}
                      type='circular'
                      size='64'
                      showHoverOverlay
                    />
                  </button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/jpeg,image/jpg,image/png,image/webp'
                    className='hidden'
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Email (read-only) */}
              <div className='flex items-center justify-between gap-6'>
                <Label description='You will be asked to verify if your email is changed.'>
                  Email
                </Label>
                <div className='w-[320px] flex-shrink-0'>
                  <Input value={userEmail} disabled placeholder='your@email.com' />
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Name */}
              <div className='flex items-center justify-between gap-6'>
                <Label description='Your display name.'>Name</Label>
                <div className='w-[320px] flex-shrink-0 space-y-1'>
                  <Input
                    placeholder='Your name'
                    data-error={errors.name ? "true" : undefined}
                    {...form.register("name")}
                  />
                  {errors.name && (
                    <HelperText type='error'>{errors.name.message ?? "Invalid name"}</HelperText>
                  )}
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Username */}
              <div className='flex items-center justify-between gap-6'>
                <Label description='This can only be changed once every 14 days.'>Username</Label>
                <div className='w-[320px] flex-shrink-0 space-y-1'>
                  <Input
                    placeholder='username'
                    staticContent={{ text: "pineway.io/" }}
                    data-error={errors.username ? "true" : undefined}
                    {...form.register("username")}
                  />
                  {errors.username && (
                    <HelperText type='error'>
                      {errors.username.message ?? "Invalid username"}
                    </HelperText>
                  )}
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Bio */}
              <div className='flex items-start justify-between gap-6'>
                <Label description='A short description visible on your public profile.'>Bio</Label>
                <div className='w-[320px] flex-shrink-0 space-y-1'>
                  <Textarea
                    placeholder='Tell people about yourself...'
                    className='h-[80px] resize-none'
                    data-error={errors.bio ? "true" : undefined}
                    {...form.register("bio")}
                  />
                  {errors.bio && (
                    <HelperText type='error'>{errors.bio.message ?? "Invalid bio"}</HelperText>
                  )}
                </div>
              </div>

              <hr className='border-gray-100' />

              {/* Profile note (private) */}
              <div className='flex items-start justify-between gap-6'>
                <Label description='This is only visible to you.'>Profile note</Label>
                <div className='w-[320px] flex-shrink-0 space-y-1'>
                  <Textarea
                    placeholder='Write a note to yourself...'
                    className='h-[130px] resize-none'
                    data-error={errors.note ? "true" : undefined}
                    {...form.register("note")}
                  />
                  {errors.note && (
                    <HelperText type='error'>{errors.note.message ?? "Invalid note"}</HelperText>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar — pushed to bottom via flex-1 on the form */}
          <div className='flex mt-10 items-center w-[524px] mx-auto justify-between rounded-[14px] bg-white pl-4 pr-2 py-2 shadow-floating-dashboard-settings'>
            <span className='text-sm text-gray-500'>Your basic information.</span>
            <Button
              type='submit'
              size='sm'
              variant={isDirty && isValid ? "primary" : "neutral"}
              disabled={!canSave && saveState === "idle"}
              className={
                "w-[124px] " +
                (isSaving
                  ? "pointer-events-none opacity-80"
                  : saveState === "saved"
                    ? "pointer-events-none"
                    : "")
              }
            >
              {saveState === "saving" ? (
                <span className='flex items-center justify-center'>
                  Saving
                  <span className='flex w-3 ml-0.5 justify-start text-left'>
                    <span className='animate-[pulse_1s_infinite]'>.</span>
                    <span className='animate-[pulse_1s_infinite_0.2s]'>.</span>
                    <span className='animate-[pulse_1s_infinite_0.4s]'>.</span>
                  </span>
                </span>
              ) : saveState === "saved" ? (
                "Saved"
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
