import { readFileSync } from "fs";
import { parse } from "papaparse";
import dotenv from "dotenv";
import { DataModel } from "../models/dataModel";

dotenv.config();

const getAllData = () => {
  return DataModel.getInstance().data;
};

const getAllScientificNames = () => {
  return DataModel.getInstance().data.data.map(
    (dataInstance) => dataInstance.scientificName
  );
};

export const dataController = { getAllData, getAllScientificNames };
