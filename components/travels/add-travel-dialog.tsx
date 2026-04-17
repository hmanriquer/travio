"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CaretDownIcon,
  CheckIcon,
  PlusIcon,
  SpinnerIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useCreateTravel } from "@/hooks/use-create-travel"
import { useTravelers } from "@/hooks/use-travelers"
import {
  createTravelSchema,
  type CreateTravelFormValues,
} from "@/lib/validations/travel.schema"

// ── Constants ─────────────────────────────────────────────────────────────────

const MEXICO_REGIONS = [
  "Ciudad de México",
  "Guadalajara",
  "Monterrey",
  "Cancún",
  "Puebla",
  "Querétaro",
  "Mérida",
  "Tijuana",
  "León",
  "Toluca",
  "Oaxaca",
  "Aguascalientes",
  "San Luis Potosí",
  "Hermosillo",
  "Culiacán",
  "Chihuahua",
]

const DEFAULT_VALUES: CreateTravelFormValues = {
  travelerId: "",
  destinationRegion: "",
  travelReason: "",
  startDate: "",
  endDate: "",
  depositAmount: "",
}

// ── AddTravelDialog ───────────────────────────────────────────────────────────

export function AddTravelDialog() {
  const [open, setOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const { data: travelers = [], isPending: loadingTravelers } = useTravelers()
  const { mutateAsync, isPending: isSubmitting } = useCreateTravel()

  const form = useForm<CreateTravelFormValues>({
    resolver: zodResolver(createTravelSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { errors } = form.formState

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleOpenChange = (isOpen: boolean) => {
    if (isSubmitting) return
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
      setPopoverOpen(false)
    }
  }

  const onSubmit = async (values: CreateTravelFormValues) => {
    try {
      await mutateAsync(values)
      toast.success("Solicitud de viaje creada correctamente")
      handleOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear la solicitud de viaje"
      )
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger button — rendered at the call site in the page header */}
      <Button onClick={() => setOpen(true)}>
        <PlusIcon weight="bold" />
        Nuevo viaje
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva solicitud de viaje</DialogTitle>
            <DialogDescription>
              Completa los datos para registrar una nueva solicitud. Los campos
              marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* ── Traveler ─────────────────────────────────────────────────── */}
            <Field>
              <FieldLabel htmlFor="travelerId">Viajero *</FieldLabel>
              <Controller
                control={form.control}
                name="travelerId"
                render={({ field }) => (
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={popoverOpen}
                          className={cn(
                            "h-8 w-full justify-between rounded-none border-input bg-transparent px-2.5 text-xs font-normal hover:bg-transparent focus-visible:ring-1 focus-visible:ring-ring/50 dark:bg-input/30",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={loadingTravelers}
                        >
                          {field.value
                            ? travelers.find((t) => t.id === field.value)?.name
                            : loadingTravelers
                              ? "Cargando viajeros..."
                              : "Seleccionar viajero..."}
                          <CaretDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-[--anchor-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar viajero..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron viajeros.</CommandEmpty>
                          <CommandGroup>
                            {travelers.map((traveler) => (
                              <CommandItem
                                key={traveler.id}
                                value={`${traveler.name} ${traveler.department ?? ""}`}
                                data-checked={field.value === traveler.id}
                                onSelect={() => {
                                  field.onChange(traveler.id)
                                  setPopoverOpen(false)
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{traveler.name}</span>
                                  {traveler.department && (
                                    <span className="text-[10px] text-muted-foreground">
                                      {traveler.department}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              <FieldError errors={[errors.travelerId]} />
            </Field>

            {/* ── Destination ──────────────────────────────────────────────── */}
            <Field>
              <FieldLabel htmlFor="destinationRegion">Destino *</FieldLabel>
              <Controller
                control={form.control}
                name="destinationRegion"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ?? "")}
                  >
                    <SelectTrigger id="destinationRegion" className="w-full">
                      <SelectValue placeholder="Seleccionar destino..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MEXICO_REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.destinationRegion]} />
            </Field>

            {/* ── Travel reason ─────────────────────────────────────────────── */}
            <Field>
              <FieldLabel htmlFor="travelReason">
                Motivo del viaje *
              </FieldLabel>
              <Textarea
                id="travelReason"
                placeholder="Describe brevemente el motivo del viaje..."
                {...form.register("travelReason")}
              />
              <FieldError errors={[errors.travelReason]} />
            </Field>

            {/* ── Date range ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="startDate">Fecha inicio *</FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register("startDate")}
                />
                <FieldError errors={[errors.startDate]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="endDate">Fecha fin *</FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register("endDate")}
                />
                <FieldError errors={[errors.endDate]} />
              </Field>
            </div>

            {/* ── Deposit amount ────────────────────────────────────────────── */}
            <Field>
              <FieldLabel htmlFor="depositAmount">
                Depósito inicial (MXN)
              </FieldLabel>
              <Input
                id="depositAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("depositAmount")}
              />
              <FieldError errors={[errors.depositAmount]} />
            </Field>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <SpinnerIcon className="size-4 animate-spin" />
                )}
                Guardar solicitud
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
