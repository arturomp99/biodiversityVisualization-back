import { Router } from "express";

export const dataRouter = Router();

dataRouter.get("/", (_req, res) => res.send("data"));
