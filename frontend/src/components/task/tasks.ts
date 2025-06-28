import axios from 'axios'
const url = "http://localhost:7000/api"

import { z } from 'zod';

export const taskSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().default(''),
    completed: z.boolean().default(false),
    priority: z.number().int().min(0).max(2).default(0), // 0: Low, 1: Medium, 2: High
    userId: z.string().optional(), // Assuming userId is a string
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;


export const api = {
    fetchTasks: async () => {
        const response = await axios.get(`${url}/tasks`);
        return response.data;
    },

    createTask: async (task: TaskSchema) => {
        const response = await axios.post(`${url}/tasks`, task);
        return response.data
    },

    updateTask: async (id: string, task: TaskSchema) => {
        const response = await axios.put(`${url}/tasks/${id}`, task);
        return response.data;
    },

    deleteTask: async (id: string) => {
        const response = await axios.delete(`${url}/tasks/${id}`);
        return response.data;
    }
}

