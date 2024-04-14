import {
  CatalogData,
  CatalogDataType,
  TotalCatalogInfoType,
} from "../models/catalogModel";

const getCatalogData = (): CatalogDataType[] | undefined => {
  return CatalogData.data;
};

const getCatalogEntry = (
  scientificName: string
): CatalogDataType | undefined => {
  const catalogData = CatalogData.data;
  return catalogData?.find(
    (catalogEntry) =>
      catalogEntry.scientificName.replace(" ", "-") === scientificName
  );
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

export const catalogController = {
  getCatalogData,
  getTotalCatalogInfo,
  getCatalogEntry,
};
