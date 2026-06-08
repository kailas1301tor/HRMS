// app/login/page.tsx
'use client'

import { motion } from 'framer-motion'
import { FormProvider } from 'react-hook-form'
import { Toaster } from 'sonner'
import { Mail, Lock, Eye, EyeOff, Loader2, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DeveloperHelper } from '@/components/login/developer-helper'
import { SetPasswordDialog } from '@/components/login/set-password-dialog'
import { useLoginForm } from '@/components/login/useLoginForm'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
}

export default function LoginPage() {
  const {
    showPassword,
    setShowPassword,
    isLoading,
    showSetPasswordModal,
    pendingAuthToken,
    methods,
    onSubmit,
    handleAutofill,
    onSetPasswordSuccess,
  } = useLoginForm()

  const { register, handleSubmit, formState: { errors } } = methods

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-core/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-teal-400/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <Toaster position="top-right" richColors />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md z-10 space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shadow-lg shadow-violet-core/20 mb-3">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-cloud font-sans">HRMS Portal</h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">Enterprise Command Center</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card/45 border-border/80 backdrop-blur-md shadow-2xl shadow-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-cloud font-sans">Welcome Back</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-sans">Please sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username or Email Address</Label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
                      <Input
                        {...register('username')}
                        id="username-input"
                        type="text"
                        autoComplete="username"
                        placeholder="name@acmecorp.com"
                        disabled={isLoading}
                        className={`pl-10 h-10 bg-midnight/35 border-border text-sm text-cloud focus-visible:ring-primary/30 ${errors.username ? 'border-destructive focus-visible:border-destructive' : ''}`}
                      />
                    </div>
                    {errors.username && <p className="text-xs font-medium text-destructive mt-1">{errors.username.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</Label>
                      <a href="#" className="text-xs text-violet-glow hover:underline font-sans">Forgot Password?</a>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
                      <Input
                        {...register('password')}
                        id="password-input"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        className={`pl-10 pr-10 h-10 bg-midnight/35 border-border text-sm text-cloud focus-visible:ring-primary/30 ${errors.password ? 'border-destructive focus-visible:border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 text-slate-500 hover:text-cloud transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs font-medium text-destructive mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox id="remember-me" className="border-border" />
                    <Label htmlFor="remember-me" className="text-xs text-slate-400 cursor-pointer font-normal">Remember this device</Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying...</> : 'Sign In'}
                  </Button>
                </form>
              </FormProvider>

              <div className="text-center mt-6">
                <span className="text-xs text-slate-500 font-sans">Need system access? </span>
                <a href="#" className="text-xs text-slate-400 hover:text-cloud transition-colors font-medium font-sans">Contact IT Admin</a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <DeveloperHelper isLoading={isLoading} onAutofill={handleAutofill} variants={itemVariants} />
      </motion.div>

      <SetPasswordDialog open={showSetPasswordModal} authToken={pendingAuthToken} onSuccess={onSetPasswordSuccess} />
    </div>
  )
}
