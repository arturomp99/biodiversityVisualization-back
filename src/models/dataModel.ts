import { readFileSync } from "fs";
import { parse } from "papaparse";
import type { ParseResult } from "papaparse";

export type TaxonomicLevelsType =
  | "phylum"
  | "class"
  | "order"
  | "family"
  | "genus"
  | "species"
  | "scientificName";

export const taxonomicLevels: TaxonomicLevelsType[] = [
  "phylum",
  "class",
  "order",
  "family",
  "genus",
  "species",
  "scientificName",
];

export type DataType = Record<TaxonomicLevelsType, string> & {
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
  position: { latitude: string; longitude: string }[];
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
  "position",
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
      const valueArray = value.split(",");
      if (field === "position") {
        const newValue = valueArray.map((entry) => {
          const entryArray = entry.split("/");
          return { latitude: entryArray[0], longitude: entryArray[1] };
        });
        return newValue;
      }
      return valueArray;
    }
    if (numberProperties.includes(field)) {
      return +value;
    }
    return value;
  }
}
