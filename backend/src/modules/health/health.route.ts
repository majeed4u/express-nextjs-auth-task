import { Router } from "express";
import { healthCheckController } from "./health.controller";


const router = Router();

router.get("/healthcheck", healthCheckController);

export default router;
