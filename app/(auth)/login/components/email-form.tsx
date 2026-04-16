import { EnvelopeSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react"
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

interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>
  isPending: boolean
  error: string | null
  onErrorClear: () => void
}

export function EmailForm({
  onSubmit,
  isPending,
  error,
  onErrorClear,
}: Readonly<EmailFormProps>) {
  const emailForm = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      await onSubmit(value.email)
    },
  })

  return (
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
            if (!value.trim()) return "El correo es necesario."
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
              return "Por favor ingresa un correo electrónico válido."
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Correo</Label>
            <div className="relative">
              <EnvelopeSimpleIcon
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="email"
                type="email"
                placeholder="correo@example.com"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value)
                  onErrorClear()
                }}
                onBlur={field.handleBlur}
                className="pl-7"
                autoComplete="email"
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
      </emailForm.Field>

      {error && <StepError message={error} />}

      <emailForm.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            className="mt-1 w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Validando..." : "Continuar"}
          </Button>
        )}
      </emailForm.Subscribe>
    </form>
  )
}
