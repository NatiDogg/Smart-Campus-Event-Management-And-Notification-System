import {z} from 'zod'

export const announcementSchema = z.object({
    title: z.string().min(5),
    content: z.string().min(6)
});

export type announcementType = z.infer<typeof announcementSchema>


