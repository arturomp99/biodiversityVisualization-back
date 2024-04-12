import {
  CatalogData,
  CatalogDataType,
  TotalCatalogInfoType,
} from "../models/catalogModel";

const getCatalogData = (): CatalogDataType[] | undefined => {
  const animalsPerPage = +(process.env.CATALOG_ANIMALS_PER_PAGE ?? 10);
  return CatalogData.data;
};

const getTotalCatalogInfo = (): TotalCatalogInfoType | undefined => {
  const totalAnimals = CatalogData.data?.length;
  const totalPages =
    totalAnimals &&
    Math.floor(totalAnimals / +(process.env.CATALOG_ANIMALS_PER_PAGE ?? 10)) +
      1;

  return {
    totalAnimals,
    totalPages,
  };
};

export const catalogController = { getCatalogData, getTotalCatalogInfo };
