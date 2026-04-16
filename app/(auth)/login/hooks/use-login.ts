import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import { checkEmailExists } from "../actions"

export type Step = "email" | "password"

export function useLogin() {
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
