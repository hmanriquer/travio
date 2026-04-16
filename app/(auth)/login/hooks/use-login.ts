import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

import { logger } from "@/lib/logger"

import { checkEmailExists } from "../actions"

const log = logger.child("auth:login")

export type Step = "email" | "password"

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [step, setStep] = useState<Step>("email")
  const [confirmedEmail, setConfirmedEmail] = useState("")

  // ── Mutations ─────────────────────────────────────────────────────────────

  const checkEmailMutation = useMutation({
    mutationFn: (email: string) => {
      log.debug("Checking email existence", { email })
      return checkEmailExists(email)
    },
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
      log.info("Sign-in successful", { callbackUrl })
      router.push(callbackUrl)
      router.refresh()
    },
    onError: (error) => {
      log.error("Sign-in failed", error)
      toast.error(error.message)
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleEmailSubmit(email: string) {
    const exists = await checkEmailMutation.mutateAsync(email)
    if (exists) {
      log.info("Email verified, advancing to password step", { email })
      setConfirmedEmail(email)
      setStep("password")
    } else {
      log.warn("Email not found", { email })
    }
  }

  async function handlePasswordSubmit(password: string) {
    await signInMutation.mutateAsync({
      email: confirmedEmail,
      password,
    })
  }

  function handleBack() {
    log.debug("User returned to email step")
    setStep("email")
    setConfirmedEmail("")
    checkEmailMutation.reset()
    signInMutation.reset()
  }

  function clearEmailError() {
    checkEmailMutation.reset()
  }

  function clearPasswordError() {
    signInMutation.reset()
  }

  // ── Derived State ─────────────────────────────────────────────────────────

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

  return {
    step,
    confirmedEmail,
    handleEmailSubmit,
    handlePasswordSubmit,
    handleBack,
    clearEmailError,
    clearPasswordError,
    emailError,
    passwordError,
    isPendingEmail: checkEmailMutation.isPending,
    isPendingPassword: signInMutation.isPending,
  }
}
