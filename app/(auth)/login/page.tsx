"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AirplaneTiltIcon } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { checkEmailExists } from "./actions"
import { EmailForm } from "./components/email-form"
import { PasswordForm } from "./components/password-form"

type Step = "email" | "password"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [step, setStep] = useState<Step>("email")
  const [confirmedEmail, setConfirmedEmail] = useState("")

  // ── Mutations ─────────────────────────────────────────────────────────────

  const checkEmailMutation = useMutation({
    mutationFn: (email: string) => checkEmailExists(email),
  })

  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (result?.error) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      router.push(callbackUrl)
      router.refresh()
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleEmailSubmit(email: string) {
    const exists = await checkEmailMutation.mutateAsync(email)
    if (exists) {
      setConfirmedEmail(email)
      setStep("password")
    }
  }

  async function handlePasswordSubmit(password: string) {
    await signInMutation.mutateAsync({
      email: confirmedEmail,
      password,
    })
  }

  function handleBack() {
    setStep("email")
    setConfirmedEmail("")
    checkEmailMutation.reset()
    signInMutation.reset()
  }

  function resolveEmailError(): string | null {
    if (checkEmailMutation.isSuccess && !checkEmailMutation.data) {
      return "No account found with this email address."
    }
    if (checkEmailMutation.isError) {
      return "Something went wrong. Please try again."
    }
    return null
  }

  const emailError = resolveEmailError()

  const passwordError = signInMutation.isError
    ? "Contraseña incorrecta. Intenta de nuevo."
    : null

  return (
    <section data-testid="login-container" className="w-full max-w-sm">
      <div data-testid="login-header" className="mb-8 text-center">
        <div className="relative mx-auto mb-6 flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <section
            data-testid="logo-icon-login"
            className="glass hover-scale relative flex size-full items-center justify-center rounded-[8px] shadow-xl"
          >
            <AirplaneTiltIcon
              weight="duotone"
              className="size-8 text-primary drop-shadow-md"
            />
          </section>
        </div>
        <h1
          data-testid="logo-text-login"
          className="font-fancy text-4xl font-black tracking-wide text-foreground italic drop-shadow-sm"
        >
          Travio
        </h1>
        <p
          data-testid="logo-description-login"
          className="mt-0.5 text-xs text-muted-foreground"
        >
          Travel expense management
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>
            {step === "email" ? "Inicia Sesión" : "Bienvenido"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "Ingresa tu correo electrónico para continuar."
              : "Ingresa tu contraseña para iniciar sesión."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* key forces remount on step change, triggering autoFocus + animation */}
          <div
            key={step}
            className="animate-in duration-200 fade-in slide-in-from-bottom-1"
          >
            {step === "email" ? (
              <EmailForm
                onSubmit={handleEmailSubmit}
                isPending={checkEmailMutation.isPending}
                error={emailError}
                onErrorClear={() => checkEmailMutation.reset()}
              />
            ) : (
              <PasswordForm
                confirmedEmail={confirmedEmail}
                onSubmit={handlePasswordSubmit}
                isPending={signInMutation.isPending}
                error={passwordError}
                onBack={handleBack}
                onErrorClear={() => signInMutation.reset()}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
