// components/login/set-password-dialog.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Loader2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth-service'
import { setPasswordSchema, type SetPasswordValues } from '@/validations/auth.schema'
import { ApiError } from '@/lib/api'

interface SetPasswordDialogProps {
  open: boolean
  authToken: string | null
  onSuccess: () => void
}

export function SetPasswordDialog({ open, authToken, onSuccess }: SetPasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: SetPasswordValues) => {
    setIsSubmitting(true)
    try {
      await authService.setPassword(data.password, data.confirmPassword, authToken ?? undefined)
      toast.success('Password set successfully!', {
        description: 'Your account is now secure. Redirecting to your dashboard...'
      })
      onSuccess()
    } catch (error: unknown) {
      let errorMessage = 'Failed to set password.'

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
                
                const formField =
                  field === 'new_password'
                    ? 'password'
                    : field === 'confirm_new_password'
                    ? 'confirmPassword'
                    : null
                if (formField) {
                  setError(formField, {
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

      toast.error('Error setting password', { description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md bg-card/90 border border-border/80 backdrop-blur-md shadow-2xl rounded-2xl p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shadow-lg shadow-violet-core/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-cloud font-sans">
            Create Your Password
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-sans max-w-xs">
            This is your first login. For security purposes, please set a password for your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              New Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
              <Input
                {...register('password')}
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`pl-10 pr-10 h-10 bg-midnight/35 border-border text-sm text-cloud focus-visible:ring-primary/30 ${
                  errors.password ? 'border-destructive focus-visible:border-destructive' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-slate-500 hover:text-cloud transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-medium text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Confirm Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
              <Input
                {...register('confirmPassword')}
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`pl-10 pr-10 h-10 bg-midnight/35 border-border text-sm text-cloud focus-visible:ring-primary/30 ${
                  errors.confirmPassword ? 'border-destructive focus-visible:border-destructive' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 text-slate-500 hover:text-cloud transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Password...
                </>
              ) : (
                'Confirm & Setup Account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
