import {z} from 'zod'

export const createEventSchema = z.object({
      
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(3),
    category: z.string().min(4, "Category is required"),
    capacity: z.number(),
    time: z.string().min(3),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
      
}).refine((date)=> date.endDate > date.startDate,{
    message: "End date must be after start date",
    path: ["endDate"]
})


export type eventCreationType = z.infer< typeof createEventSchema>

