import { db } from "../../db";
import { TaskSchema } from "./task.types";


// Ensure the user is authenticated before performing any task operations

export const taskService = {

    async createTask(data: TaskSchema) {

        const task = await db.task.create({
            data
        });
        return task;
    },

    async getTasks() {
        const tasks = await db.task.findMany({
            omit: {
                userId: true
            }
        })

        return tasks;
    },

    async getTaskById(id: string) {
        const task = await db.task.findUnique({
            where: { id },
        });
        return task;
    },

    async updateTask(id: string, data: any) {
        const task = await db.task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description || '',
                priority: data.priority,
                completed: data.completed,
                userId: data.userId
            },
        });
        return task;
    },

    async deleteTask(id: string) {
        const task = await db.task.delete({
            where: { id },
        });
        return task;
    },
};
