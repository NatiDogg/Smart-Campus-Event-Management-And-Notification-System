import {z} from 'zod'

export const categoryCreationSchema = z.object({
    name: z.string().min(3, "Category Name must be at least 3 characters"),
    description: z.string().min(4,"Category Description must be at least 3 characters")

})

export type categoryCreationType = z.infer<typeof categoryCreationSchema>