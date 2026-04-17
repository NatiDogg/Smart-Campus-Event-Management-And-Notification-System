import {z} from 'zod'

export const announcementSchema = z.object({
    title: z.string().min(5,'Title must be at least 5 characters'),
    content: z.string().min(6,'Content must be at least 6 characters')
});

export type announcementType = z.infer<typeof announcementSchema>


