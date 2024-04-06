import { readFileSync } from "fs";
import { parse } from "papaparse";
import type { ParseResult } from "papaparse";

type DataType = {
  occurrenceID: string[];
  basisOfRecord: string[];
  "Preparations (Physical Samples)": string;
  eventDate: string[];
  scientificName: string;
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  taxonRank: string;
  identifiedBy: string[];
  "AI Detection Method/Model": string[];
  "Confidence%": string[];
  "Verification Method": string[];
  "Verification Name": string[];
  dateIdentified: string[];
  nomenclaturalCode: string;
  individualCount: string[];
  organismQuantity: string[];
  organismQuantityType: string[];
  decimalLatitude: string[];
  decimalLongitude: string[];
  geodeticDatum: string[];
  coordinateUncertaintyInMeters: string[];
  verbatimCoordinates: string[];
  verbatimCoordinateSystem: string[];
  higherGeography: string;
  continent: string;
  country: string;
  countryCode: string;
  stateProvince: string;
  county: string;
  locality: string;
  verbatimLocality: string;
  occurrenceRemarks: string[];
  references: string[];
  dropId: string;
  observationsNum: number;
};

const arrayProperties = [
  "occurrenceID",
  "basisOfRecord",
  "eventDate",
  "identifiedBy",
  "AI Detection Method/Model",
  "Confidence%",
  "Verification Method",
  "Verification Name",
  "dateIdentified",
  "individualCount",
  "organismQuantity",
  "organismQuantityType",
  "decimalLatitude",
  "decimalLongitude",
  "geodeticDatum",
  "coordinateUncertaintyInMeters",
  "verbatimCoordinates",
  "verbatimCoordinateSystem",
  "occurrenceRemarks",
  "references",
];

const numberProperties = ["observationsNum"];

export class DataModel {
  private static instance: DataModel;
  public data: ParseResult<DataType>;

  private constructor() {
    const dataString = readFileSync(process.env.CSV_FILE || "", "utf8");
    this.data = parse(dataString, {
      header: true,
      delimiter: process.env.CSV_DELIMITER || ",",
      transform: this.rowTransform,
    });
  }

  static getInstance(): DataModel {
    if (!DataModel.instance) {
      // Create a new instance if one doesn't exist
      DataModel.instance = new DataModel();
    }
    // Return the existing instance if it already exists
    return DataModel.instance;
  }

  private rowTransform(value: string, field: string) {
    if (arrayProperties.includes(field)) {
      return value.split(",");
    }
    if (numberProperties.includes(field)) {
      return +value;
    }
    return value;
  }
}
