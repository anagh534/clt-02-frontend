import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from './useToast'

export function useSessionExpiry() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { warning } = useToast()

  useEffect(() => {
    function handleExpiry() {
      logout()
      warning('Session Expired', 'You were inactive for 30 days. Please log in again.')
      // navigate('/login', { replace: true })
    }

    window.addEventListener('auth:session-expired', handleExpiry)
    return () => window.removeEventListener('auth:session-expired', handleExpiry)
  }, [logout, navigate, warning])
}
