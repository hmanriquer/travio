import { z } from "zod"

export const createTravelSchema = z
  .object({
    travelerId: z.string().min(1, "El viajero es requerido"),
    destinationRegion: z
      .string()
      .min(2, "El destino debe tener al menos 2 caracteres")
      .max(255, "El destino es demasiado largo"),
    travelReason: z
      .string()
      .min(5, "El motivo debe tener al menos 5 caracteres"),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().min(1, "La fecha de fin es requerida"),
    depositAmount: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        "El monto debe ser un número positivo"
      ),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.startDate <= data.endDate,
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["endDate"],
    }
  )

export type CreateTravelFormValues = z.infer<typeof createTravelSchema>
