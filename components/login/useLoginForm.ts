// components/login/useLoginForm.ts
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { authService, type LoginResponse } from '@/services/auth-service'
import { loginSchema, type LoginValues } from '@/validations/auth.schema'
import { ApiError } from '@/lib/api'

interface PendingAuth {
  token: string
  username: string
  email: string
}

interface UseLoginFormReturn {
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  isLoading: boolean
  showSetPasswordModal: boolean
  pendingAuthToken: string | null
  methods: UseFormReturn<LoginValues>
  onSubmit: (data: LoginValues) => Promise<void>
  handleAutofill: () => void
  onSetPasswordSuccess: () => void
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false)
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null)

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const { setValue, setError } = methods

  const persistAuthCookies = useCallback((token: string, username: string, email: string): void => {
    document.cookie = `auth_session=${token}; path=/; max-age=86400; SameSite=Lax`
    document.cookie = `auth_username=${username}; path=/; max-age=86400; SameSite=Lax`
    document.cookie = `auth_email=${email}; path=/; max-age=86400; SameSite=Lax`
  }, [])

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    try {
      const response: LoginResponse = await authService.login(data.username, data.password)
      const dataObj = response.results?.data
      const token = dataObj?.access || 'true'
      const username = dataObj?.username ?? ''
      const email = dataObj?.email ?? ''

      if (dataObj && dataObj.has_password_changed === false) {
        setPendingAuth({ token, username, email })
        setShowSetPasswordModal(true)
        setIsLoading(false)
      } else {
        persistAuthCookies(token, username, email)
        toast.success('Login successful! Redirecting...', { description: 'Welcome to your HRMS dashboard.' })
        setIsLoading(false)
        router.refresh()
        setTimeout(() => { router.push('/') }, 800)
      }
    } catch (error: unknown) {
      setIsLoading(false)
      let errorMessage = 'Invalid username or password.'

      if (error instanceof ApiError) {
        errorMessage = error.message || errorMessage
        const errorData = error.data
        if (errorData && typeof errorData === 'object' && 'errors' in errorData) {
          const backendErrors = (errorData as { errors: Record<string, unknown> }).errors
          if (backendErrors && typeof backendErrors === 'object') {
            const errorMessages: string[] = []
            Object.entries(backendErrors).forEach(([field, messages]) => {
              const messagesArr = Array.isArray(messages) ? messages : [String(messages)]
              if (messagesArr.length > 0) {
                const cleanMsg = String(messagesArr[0])
                errorMessages.push(cleanMsg)
                if (field === 'username' || field === 'password') {
                  setError(field, {
                    type: 'server',
                    message: cleanMsg,
                  })
                }
              }
            })
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join(' ')
            }
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error('Login Failed', { description: errorMessage })
    }
  }

  const handleAutofill = () => {
    setValue('username', 'john@example.com')
    setValue('password', 'securepassword123')
    toast.info('Credentials filled!', { description: 'Click Sign In to proceed.' })
  }

  const onSetPasswordSuccess = () => {
    if (pendingAuth) {
      persistAuthCookies(pendingAuth.token, pendingAuth.username, pendingAuth.email)
      setPendingAuth(null)
    }
    setShowSetPasswordModal(false)
    toast.success('Login successful! Redirecting...', { description: 'Welcome to your HRMS dashboard.' })
    router.refresh()
    setTimeout(() => { router.push('/') }, 800)
  }

  return {
    showPassword,
    setShowPassword,
    isLoading,
    showSetPasswordModal,
    pendingAuthToken: pendingAuth?.token ?? null,
    methods,
    onSubmit,
    handleAutofill,
    onSetPasswordSuccess,
  }
}
