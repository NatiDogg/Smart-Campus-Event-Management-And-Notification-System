
import {z} from 'zod'

export const createOrganizerSchema = z.object({
     
       fullName: z.string().min(4, "Full Name is Required"),
       email: z.email(),
       password: z.string().min(6, "Password must be at least 6 characters"),
       organizationName: z.string().min(4,"organization Name is Required"),
       phoneNumber: z.string().min(6,"Phone Number is Required")
})


export type organizerCreationType = z.infer<typeof createOrganizerSchema >