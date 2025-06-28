import { Router } from "express";
import {
    createTaskHandler,
    getTasksHandler,
    updateTaskHandler,
    deleteTaskHandler
} from "./task.controller";

const taskRouter = Router();

taskRouter.post("/tasks", createTaskHandler);
taskRouter.get("/tasks", getTasksHandler);
taskRouter.put("/tasks/:id", updateTaskHandler);
taskRouter.delete("/tasks/:id", deleteTaskHandler);

export default taskRouter