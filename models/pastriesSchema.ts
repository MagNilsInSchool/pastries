import { z } from "zod";

export const pastryInputSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Pastry name needs to be at least 2 characters long." })
            .max(20, { message: "Pastry name can't exceed 20 characters." }),
        description: z
            .string()
            .min(10, { message: "Pastry description needs to be at least 10 characters long." })
            .max(100, { message: "Pastry name can't exceed 100 characters." }),
        price: z.number().positive({ message: "Pastry price needs to be a positive number." }),
        allergens: z
            .array(
                z.union([
                    z.literal("nuts"),
                    z.literal("gluten"),
                    z.literal("dairy"),
                    z.literal("soy"),
                    z.literal("eggs"),
                ])
            )
            .optional(),
    })
    .strict(); // Tillåter enbart nycklar definierade i schema.

export const pastryUpdateSchema = pastryInputSchema
    .partial()
    .refine((obj) => Object.keys(obj).length > 0, {
        message: "At least one field must be provided for update",
    })
    .strict();

export const pastrySchema = pastryInputSchema.extend({
    id: z.number().min(1).positive(),
});

export const pastriesSchema = z.array(pastrySchema);

export type PastryInput = z.infer<typeof pastryInputSchema>;
export type PastryUpdate = z.infer<typeof pastryUpdateSchema>;
export type Pastry = z.infer<typeof pastrySchema>;
export type Pastries = z.infer<typeof pastriesSchema>;
