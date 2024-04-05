import { Router } from "express";

export const filtersRouter = Router();

filtersRouter.get("/", (_req, res) => res.send("filters"));
