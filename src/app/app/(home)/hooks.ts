import { httpClient } from "@/lib/http/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parseResponse } from "hono/client";
import type { UpdateProfile, Profile } from "~/db/schema/profiles";

export function useProfile(initialData?: Profile & { email?: string }) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await httpClient.actions.profile.$get();
      const result = await parseResponse(res);

      if (!result.success) {
        throw new Error(result.error.userMessage);
      }

      return result.data as Profile & { email?: string };
    },
    initialData,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfile) => {
      const res = await httpClient.actions.profile.$patch({
        json: data,
      });
      const result = await parseResponse(res);

      if (!result.success) {
        throw new Error(result.error.userMessage);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
