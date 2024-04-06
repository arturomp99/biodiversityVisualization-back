import { Router } from "express";
import { dataController } from "../controllers";

export const geojsonRouter = Router();

geojsonRouter.get("/", (_req, res) => res.json());
