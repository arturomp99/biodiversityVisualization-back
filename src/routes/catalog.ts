import { Router } from "express";

export const catalogRouter = Router();

catalogRouter.get("/", (_req, res) => res.send("catalog"));
