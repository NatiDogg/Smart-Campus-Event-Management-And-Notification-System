import { z } from 'zod';

export const subscriptionSchema = z.object({
    
    categories: z.array(z.string())
});


export type subscriptionSchemaType = z.infer<typeof subscriptionSchema>
