import express from "express";
import dotenv from "dotenv";
import { catalogRouter, dataRouter, filtersRouter } from "./routes";
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use("/data", dataRouter);
app.use("/catalog", catalogRouter);
app.use("/filters", filtersRouter);

const port = process.env.PORT || 4000;
app.listen(+port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
