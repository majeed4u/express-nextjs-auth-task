import { Request, Response } from "express";

export function healthCheckController(req: Request, res: Response) {
  res.send({
    msg: "Api is healthy",
    status: "200 OK",
  });
}
