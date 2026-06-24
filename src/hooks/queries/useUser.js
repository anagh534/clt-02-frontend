import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../../services/userService";
import { useAuthStore } from "../../store/authStore";

export function useProfile() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
    staleTime: 0,
    refetchOnMount: true,
    initialData: user || undefined,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useCustomizeData() {
  const defaultData = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["customize"],
    queryFn: userService.getCustomize,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    initialData: defaultData || undefined,
  });
}

export function useUpdateCustomize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateCustomize,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customize"] }),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: userService.changePassword });
}
