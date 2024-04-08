import { Router } from "express";
import { filtersController } from "../controllers/filtersController";

export const filtersRouter = Router();

filtersRouter.get("/", (_req, res) =>
  res.json(filtersController.getAllFilters())
);
