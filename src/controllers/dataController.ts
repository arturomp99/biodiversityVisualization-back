import { readFileSync } from "fs";
import { parse } from "papaparse";
import dotenv from "dotenv";
import { DataModel } from "../models/dataModel";

dotenv.config();

const getAllData = () => {
  return DataModel.getInstance().data;
};

getAllData();

export const dataController = { getAllData };
