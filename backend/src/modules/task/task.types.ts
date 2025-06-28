import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    completed: z.boolean().default(false),
    priority: z.number().int().min(0).max(2).default(0),
    userId: z.string()
});

export type TaskSchema = z.infer<typeof taskSchema>;
