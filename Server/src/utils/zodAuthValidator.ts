import {z} from 'zod'



export const authRegisterSchema = z.object({
     
    fullName: z.string().min(5,"Full Name must be at least 5 characters"),
    studentId: z.string().min(5,"Student Id must be at least 5 characters"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profile: z.string().min(4).optional(),
    provider: z.string().min(4).optional()
})

export const authLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const adminLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters")
})


export type authUserRegisterType = z.infer<typeof authRegisterSchema>
export type authUserLoginType = z.infer<typeof authLoginSchema>
export type authAdminLoginType = z.infer<typeof adminLoginSchema>