"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EnvelopeSimple, Lock, WarningCircle } from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { checkEmailExists } from "./actions"

type Step = "email" | "password"

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <WarningCircle className="size-3 shrink-0" />
      {message}
    </p>
  )
}

function StepError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
      <WarningCircle className="mt-px size-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

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

  // ── Email form ────────────────────────────────────────────────────────────

  const emailForm = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      const exists = await checkEmailMutation.mutateAsync(value.email)
      if (exists) {
        setConfirmedEmail(value.email)
        setStep("password")
      }
    },
  })

  // ── Password form ─────────────────────────────────────────────────────────

  const passwordForm = useForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync({
        email: confirmedEmail,
        password: value.password,
      })
    },
  })

  // ── Helpers ───────────────────────────────────────────────────────────────

  function goBack() {
    setStep("email")
    checkEmailMutation.reset()
    signInMutation.reset()
    passwordForm.reset()
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
    ? "Incorrect password. Please try again."
    : null

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-base font-semibold tracking-tight">Travio</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Travel expense management
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{step === "email" ? "Sign in" : "Welcome back"}</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to continue."
              : "Enter your password to sign in."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* key forces remount on step change, triggering autoFocus + animation */}
          <div
            key={step}
            className="animate-in duration-200 fade-in slide-in-from-bottom-1"
          >
            {/* ── Step 1: Email ──────────────────────────────────────────── */}
            {step === "email" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  void emailForm.handleSubmit()
                }}
                className="flex flex-col gap-4"
              >
                <emailForm.Field
                  name="email"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value.trim()) return "Email is required."
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
                        return "Please enter a valid email address."
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <EnvelopeSimple
                          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                          aria-hidden
                        />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            // clear server error banner as soon as user edits
                            if (
                              checkEmailMutation.isSuccess ||
                              checkEmailMutation.isError
                            ) {
                              checkEmailMutation.reset()
                            }
                          }}
                          onBlur={field.handleBlur}
                          className="pl-7"
                          autoComplete="email"
                          autoFocus
                          aria-invalid={
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0
                          }
                          disabled={checkEmailMutation.isPending}
                        />
                      </div>
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <FieldError
                            message={String(field.state.meta.errors[0])}
                          />
                        )}
                    </div>
                  )}
                </emailForm.Field>

                {emailError && <StepError message={emailError} />}

                <emailForm.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button
                      type="submit"
                      className="mt-1 w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Checking…" : "Continue"}
                    </Button>
                  )}
                </emailForm.Subscribe>
              </form>
            ) : (
              /* ── Step 2: Password ─────────────────────────────────────── */
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  void passwordForm.handleSubmit()
                }}
                className="flex flex-col gap-4"
              >
                {/* Confirmed email badge */}
                <div className="flex items-center justify-between border border-input bg-muted/40 px-2.5 py-1.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <EnvelopeSimple className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-xs text-muted-foreground">
                      {confirmedEmail}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={signInMutation.isPending}
                    className="ml-3 shrink-0 text-xs text-primary underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-50"
                  >
                    Change
                  </button>
                </div>

                <passwordForm.Field
                  name="password"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value) return "Password is required."
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                          aria-hidden
                        />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            // clear server error banner as soon as user edits
                            if (signInMutation.isError) {
                              signInMutation.reset()
                            }
                          }}
                          onBlur={field.handleBlur}
                          className="pl-7"
                          autoComplete="current-password"
                          autoFocus
                          aria-invalid={
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0
                          }
                          disabled={signInMutation.isPending}
                        />
                      </div>
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <FieldError
                            message={String(field.state.meta.errors[0])}
                          />
                        )}
                    </div>
                  )}
                </passwordForm.Field>

                {passwordError && <StepError message={passwordError} />}

                <passwordForm.Subscribe
                  selector={(state) => state.isSubmitting}
                >
                  {(isSubmitting) => (
                    <Button
                      type="submit"
                      className="mt-1 w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in…" : "Sign in"}
                    </Button>
                  )}
                </passwordForm.Subscribe>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
