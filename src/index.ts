import express from "express";
import dotenv from "dotenv";
import {
  audioRouter,
  catalogRouter,
  dataRouter,
  filtersRouter,
  geojsonRouter,
} from "./routes";
import { CatalogData } from "./models/catalogModel";

const cors = require("cors");

dotenv.config();
CatalogData.init();

const app = express();

app.use(cors());
app.use("/data", dataRouter);
app.use("/geojson", geojsonRouter);
app.use("/catalog", catalogRouter);
app.use("/filters", filtersRouter);
app.use("/audio", audioRouter);

app.use(
  process.env.AUDIO_SLUG ?? "/assets/audio",
  express.static(process.env.AUDIO_REPO ?? "public/audio")
);

const port = process.env.PORT || 4000;
app.listen(+port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
