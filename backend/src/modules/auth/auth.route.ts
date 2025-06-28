import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import router from "../index.routes";
import { auth } from ".";
const authRouter = Router();




export default authRouter;