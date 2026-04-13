import {z} from 'zod'

export const createEventSchema = z.object({
      
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(3,"Location must be at least 3 characters"),
    category: z.string().min(4, "Category is required"),
    capacity: z.coerce.number().min(1,"Capacity must be at least 1"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
      
}).refine((data)=> data.endDate > data.startDate,{
    message: "End date must be after start date",
    path: ["endDate"]
})

export const updateEventSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters").optional(),
      description: z.string().min(10, "Description must be at least 10 characters").optional(),
      location: z.string().min(3, "Location must be at least 3 characters").optional(),
      category: z.string().min(4, "Category is required").optional(),
      capacity: z.coerce.number().min(1, "Capacity must be at least 1").optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional()





}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true; // only validate if both are provided
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});


export type eventCreationType = z.infer< typeof createEventSchema>
export type eventupdateType = z.infer<typeof updateEventSchema>

