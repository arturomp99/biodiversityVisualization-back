import { Router } from "express";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { readFolder } from "../controllers/geojsonController";

export const geojsonRouter = Router();

dotenv.config();

geojsonRouter.get("/", (_req, res) => {
  const existsRepo = existsSync(
    process.env.GEOJSON_REPO || "public/dronePaths"
  );
  if (!existsRepo) {
    res.status(404).send("Folder not found");
  }

  res.json(readFolder(process.env.GEOJSON_REPO || "public/geojson"));
});
