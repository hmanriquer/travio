import {
  EnvelopeSimpleIcon,
  LockIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function FieldError({ message }: Readonly<{ message: string }>) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <WarningCircleIcon className="size-3 shrink-0" />
      {message}
    </p>
  )
}

function StepError({ message }: Readonly<{ message: string }>) {
  return (
    <div className="flex items-start gap-2 border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
      <WarningCircleIcon className="mt-px size-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

interface PasswordFormProps {
  confirmedEmail: string
  onSubmit: (password: string) => Promise<void>
  isPending: boolean
  error: string | null
  onBack: () => void
  onErrorClear: () => void
}

export function PasswordForm({
  confirmedEmail,
  onSubmit,
  isPending,
  error,
  onBack,
  onErrorClear,
}: Readonly<PasswordFormProps>) {
  const passwordForm = useForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }) => {
      await onSubmit(value.password)
    },
  })

  return (
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
          <EnvelopeSimpleIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs text-muted-foreground">
            {confirmedEmail}
          </span>
        </div>
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="ml-3 shrink-0 text-xs text-primary underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-50"
        >
          Cambiar
        </button>
      </div>

      <passwordForm.Field
        name="password"
        validators={{
          onBlur: ({ value }) => {
            if (!value) return "Contraseña es requerida."
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <LockIcon
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
                  onErrorClear()
                }}
                onBlur={field.handleBlur}
                className="pl-7"
                autoComplete="current-password"
                autoFocus
                aria-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                disabled={isPending}
              />
            </div>
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <FieldError message={field.state.meta.errors[0] as string} />
              )}
          </div>
        )}
      </passwordForm.Field>

      {error && <StepError message={error} />}

      <passwordForm.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            className="mt-1 w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Iniciando sesión…" : "Iniciar sesión"}
          </Button>
        )}
      </passwordForm.Subscribe>
    </form>
  )
}
