import { z } from 'zod';

export const subscriptionSchema = z.object({
    
    body: z.array(z.string())
});


export type subscriptionSchemaType = z.infer<typeof subscriptionSchema>
