import { Router } from "express";
import { catalogController } from "../controllers/catalogController";

export const catalogRouter = Router();

catalogRouter.get("/data/:pageId", (req, res) => {
  const pageId: string = req.params.pageId;
  res.json(catalogController.getCatalogData(+pageId ?? 1));
});

catalogRouter.get("/total", (_req, res) =>
  res.json(catalogController.getTotalCatalogInfo())
);
