import { Router } from "express";
import { catalogController } from "../controllers/catalogController";

export const catalogRouter = Router();

catalogRouter.get("/data", (_req, res) => {
  res.json(catalogController.getCatalogData());
});

catalogRouter.get("/total", (_req, res) =>
  res.json(catalogController.getTotalCatalogInfo())
);
