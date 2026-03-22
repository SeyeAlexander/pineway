"use client";

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { showToast } from "@/components/ui/toast/toast";
import { httpClient } from "@/lib/http/client";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { parseResponse } from "hono/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HTMLInputTypeAttribute, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const supabase = createClient();

  // Get redirectTo from URL params
  const redirectTo = searchParams.get("redirectTo");

  const [inputType, setInputType] =
    useState<HTMLInputTypeAttribute>("password");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createProfileMutation } = useMutation({
    mutationFn: async (userId: string) => {
      const result = await parseResponse(
        httpClient.actions.profile.$post({
          json: {
            userId,
          },
        }),
      );

      if (!result.success) {
        throw new Error(result.error.userMessage);
      }

      return result.data;
    },
  });

  const signinFormSchema = z.object({
    email: z.email({
      message: "Please provide a valid email.",
    }),
    password: z.string().trim(),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    criteriaMode: "all",
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(signinFormSchema),
  });

  const handleSubmit = async (data: z.infer<typeof signinFormSchema>) => {
    try {
      setIsSubmitting(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp(data);

      if (!user || error) {
        throw error;
      }

      await createProfileMutation(user.id);

      const destination =
        redirectTo && redirectTo.startsWith("/app") ? redirectTo : "/app";

      window.location.href = destination;
    } catch (error) {
      showToast({
        title: "Failed to create account.",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "expanded",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-y-4"
      ref={formRef}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          autoFocus
          placeholder="apricot@email.com"
          {...form.register("email")}
        />
      </div>

      <div className="grid gap-2">
        <Label>Password</Label>
        <Input
          autoFocus
          placeholder="••••••"
          type={inputType}
          showPasswordViewToggle
          onPasswordViewToggleClick={() => {
            setInputType(inputType === "password" ? "text" : "password");
          }}
          {...form.register("password")}
        />
      </div>

      <Link href="/login" className="-mt-2 self-start">
        <Button variant="link" type="button" label="Have an account? Login" />
      </Link>

      <Button
        label="Continue"
        type="submit"
        className="mt-2"
        isLoading={isSubmitting}
        disabled={isSubmitting || !form.formState.isValid}
      />
    </form>
  );
}
