import {z} from 'zod'



export const authRegisterSchema = z.object({
     
    fullName: z.string().min(5),
    studentId: z.string().min(5),
    email: z.email(),
    password: z.string().min(6)
})

export const authLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})


export type authUserRegisterType = z.infer<typeof authRegisterSchema>
export type authUserLoginType = z.infer<typeof authLoginSchema>
