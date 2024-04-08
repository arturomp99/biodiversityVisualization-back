import { Router } from "express";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { audioController } from "../controllers";

export const audioRouter = Router();

dotenv.config();

audioRouter.get("/", (_req, res) => {
  const existsRepo = existsSync(process.env.AUDIO_REPO || "public/audio");
  if (!existsRepo) {
    res.status(404).send("Folder not found");
  }

  res.json(
    audioController.getAudioRepo(process.env.AUDIO_REPO ?? "public / audio")
  );
});
