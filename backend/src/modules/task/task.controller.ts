import { RequestHandler } from "express";
import { taskService } from "./task.service";
import { TaskSchema, taskSchema } from "./task.types";
import { AppError } from "../middleware/appError";
import { ZodError } from "zod";
import { handleServerError, handleZodeError } from "../middleware/errorHandler";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";



export const createTaskHandler: RequestHandler<TaskSchema> = async (req, res) => {
    try {
        const data = taskSchema.parse(req.body);
        const task = await taskService.createTask(data);
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                success: false,
                message: error.message
            })

        }

        if (error instanceof ZodError) {
            const zodResponse = handleZodeError(error)
            res.status(zodResponse.status).json(zodResponse)
        }
        if (error instanceof Error) {
            const gneralResponse = handleServerError(error)
            res.status(gneralResponse.status).json(gneralResponse)
        }
    }
}


export const getTasksHandler: RequestHandler = async (req, res) => {

    try {
        const tasks = await taskService.getTasks()
        if (!tasks) {
            throw new AppError("No task Fond", 404)
        }

        res.status(200).json(tasks)

    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                success: false,
                message: error.message
            })

        }

        if (error instanceof ZodError) {
            const zodResponse = handleZodeError(error)
            res.status(zodResponse.status).json(zodResponse)
        }
        if (error instanceof Error) {
            const gneralResponse = handleServerError(error)
            res.status(gneralResponse.status).json(gneralResponse)
        }

    }
}

export const updateTaskHandler: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // First retrieve the existing task
        const existingTask = await taskService.getTaskById(id);
        if (!existingTask) {
            throw new AppError("Task not found", 404);
        }

        // Merge existing task with updates
        const updatedTask = await taskService.updateTask(id, {
            ...existingTask,
            ...data
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        if (error instanceof ZodError) {
            const zodResponse = handleZodeError(error);
            res.status(zodResponse.status).json(zodResponse);
        }
        if (error instanceof Error) {
            const generalResponse = handleServerError(error);
            res.status(generalResponse.status).json(generalResponse);
        }
    }
}

export const deleteTaskHandler: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await taskService.deleteTask(id);
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        if (error instanceof Error) {
            const generalResponse = handleServerError(error);
            res.status(generalResponse.status).json(generalResponse);
        }
    }
}