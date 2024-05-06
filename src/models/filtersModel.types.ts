import { TaxonomicLevelsType } from "./dataModel";

export type FiltersType = {
  taxonomic?: Record<TaxonomicLevelsType, string[]>;
  temporal?: (Date | undefined)[];
  drop?: string[];
  confidence?: number;
  location?: { latitude: number; longitude: number }[];
  identificationMethod?: string[];
};
