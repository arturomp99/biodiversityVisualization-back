import { uniq } from "lodash";
import { DataType, taxonomicLevels } from "../models/dataModel";
import { FiltersType } from "../models/filtersModel.types";
import { dataController } from "./dataController";

export const getAllFilters = (): FiltersType => {
  const data = dataController.getAllData().data;
  return {
    taxonomic: getTaxonomicFiltersData(data),
    temporal: getTemporalFiltersData(data),
    drop: getDropFiltersData(data),
    location: getLocationFiltersData(data),
    identificationMethod: getIdentificationMethodData(data),
  };
};

const getTaxonomicFiltersData = (data: DataType[]) => {
  const taxonomicFiltersData = data.reduce<
    NonNullable<FiltersType["taxonomic"]>
  >(
    (result, currentObject) => {
      for (const level of taxonomicLevels) {
        const existingLevel = result[level].find(
          (value: string) => value === (currentObject[level] as string)
        );
        !existingLevel && result[level].push(currentObject[level] as string);
      }
      return result;
    },
    {
      phylum: [],
      class: [],
      order: [],
      family: [],
      genus: [],
      species: [],
      scientificName: [],
    }
  );

  return taxonomicFiltersData;
};

const getTemporalFiltersData = (data: DataType[]) => {
  const dateStrings = data.flatMap((dataPoint) =>
    dataPoint.eventDate.map((pointDate) => new Date(pointDate).getTime())
  );

  const timeMin = Math.min(...dateStrings);
  const timeMax = Math.max(...dateStrings);

  return [new Date(timeMin), new Date(timeMax)];
};

const getDropFiltersData = (data: DataType[]) => {
  const dropFiltersData = data.reduce<NonNullable<FiltersType["drop"]>>(
    (result, currentObject) => {
      const existingId = result.find((value) => value === currentObject.dropId);
      !existingId && result.push(currentObject.dropId as string);
      return result;
    },
    []
  );

  return dropFiltersData;
};

const getLocationFiltersData = (data: DataType[]) => {
  const locationFiltersData = data
    .flatMap((dataPoint) =>
      dataPoint.position.map((dataPointPosition) => ({
        latitude: +dataPointPosition.latitude,
        longitude: +dataPointPosition.longitude,
      }))
    )
    .reduce<NonNullable<FiltersType["location"]>>(
      (acc: NonNullable<FiltersType["location"]>, curr) => {
        const accFound = acc.find(
          (accumulatedPosition) =>
            accumulatedPosition.latitude === curr.latitude &&
            accumulatedPosition.longitude === curr.longitude
        );
        return !!accFound ? acc : [...acc, curr];
      },
      []
    );
  return locationFiltersData;
};

const getIdentificationMethodData = (data: DataType[]) => {
  const identificationMethodFiltersData = uniq(
    data.flatMap(
      (dataPoint): NonNullable<FiltersType["identificationMethod"]> =>
        dataPoint.identifiedBy
    )
  );
  return identificationMethodFiltersData;
};

export const filtersController = { getAllFilters };
