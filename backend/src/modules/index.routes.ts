import { Router } from "express";
import healthCheckRoutes from "./health/health.route";
import taskRouter from "./task/task.route";

const router = Router();

router.use("", healthCheckRoutes);
// Add auth routes
router.use("", taskRouter);

export default router;
