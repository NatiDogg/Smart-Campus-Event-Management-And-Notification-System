import {z} from 'zod'

export const feedbackSchema = z.object({
    rating: z.coerce.number().min(1, "Rating must be atleast 1 star").max(5, "Rating cannot exceed 5 stars"),
    comment: z.string().min(5, "Comment must be atleast 5 characters").max(500, "Comment is too long (max 500 characters)")
})

export type feedbackType = z.infer<typeof feedbackSchema >