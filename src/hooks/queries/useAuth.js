import { useMutation } from '@tanstack/react-query'
import authService from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

export function useLoginMutation() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => login(data),
  })
}

export function useRegisterMutation() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => login(data),
  })
}
