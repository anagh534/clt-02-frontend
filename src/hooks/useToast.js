import { useCallback } from 'react'
import { useUIStore } from '../store/useUIStore'

export function useToast() {
  const addToast = useUIStore((s) => s.addToast)

  const toast   = useCallback((opts) => addToast(opts), [addToast])
  const success = useCallback((title, message = '') => addToast({ title, message, type: 'success' }), [addToast])
  const error   = useCallback((title, message = '') => addToast({ title, message, type: 'error' }), [addToast])
  const warning = useCallback((title, message = '') => addToast({ title, message, type: 'warning' }), [addToast])
  const info    = useCallback((title, message = '') => addToast({ title, message, type: 'info' }), [addToast])

  return { toast, success, error, warning, info }
}
