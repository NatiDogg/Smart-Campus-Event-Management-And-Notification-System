import {z} from 'zod'

const baseProfileSchema = z.object({
  fullName: z.string().min(2).max(50).optional(),
  email: z.email().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional()
});

const studentSchema = baseProfileSchema.extend({
  role: z.literal("student"),
  department: z.string().optional(),
  studentId: z.string().optional()
});
const organizerSchema = baseProfileSchema.extend({
  role: z.literal("organizer"),
  organizationName: z.string().min(2).optional(),
  phoneNumber: z.string().min(10).optional(),
});
const adminSchema = baseProfileSchema.extend({
  role: z.literal("admin"),
  phoneNumber: z.string().optional(),
  adminLevel: z.enum(["super", "moderator", "basic"]).optional(),
});

export const updateProfileValidator = z.discriminatedUnion("role",[
    studentSchema,
    organizerSchema,
    adminSchema
])
export type UpdateProfileInput = z.infer<typeof updateProfileValidator>;