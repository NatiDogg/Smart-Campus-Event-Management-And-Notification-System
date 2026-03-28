import {z} from 'zod'


export const forgetPasswordSchema = z.object({
    email: z.email()
})

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    token: z.string().min(4,'Invalid reset token')
})


export type forgetPasswordType = z.infer<typeof forgetPasswordSchema>
export type resetPasswordType = z.infer<typeof resetPasswordSchema>


