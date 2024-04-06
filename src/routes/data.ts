import { Router } from "express";
import { dataController } from "../controllers";

export const dataRouter = Router();

dataRouter.get("/", (_req, res) => res.json(dataController.getAllData()));
