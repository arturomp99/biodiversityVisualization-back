import { dataController } from "../controllers";
import axios from "axios";

export type TotalCatalogInfoType = {
  totalAnimals?: number;
  totalPages?: number;
};

export type CatalogDataType = {
  species?: string;
  usageKey?: string;
  vernacularName?: string;
  descriptions?: GBIFDescriptionType["results"];
  wikipediaResult?: WikipediaResultType;
};

type GBIFVernacularNamesType = {
  results: { vernacularName: string; language: string }[];
};

type GBIFDescriptionType = {
  results: {
    type:
      | "conservation"
      | "discussion"
      | "distribution"
      | "materials_examined"
      | "activity"
      | "biology_ecology"
      | "breeding"
      | "description"
      | "food_feeding"
      | "vernacular_names";
    description: string;
    source: string;
  }[];
};

type WikipediaResponseType = {
  query: {
    pages: {
      [key: string]: {
        pageId: number;
        title: string;
        thumbnail: { source: string };
        description: string;
        fullurl: string;
      };
    };
  };
};

type WikipediaResultType = {
  pageId: number;
  title: string;
  thumbnail: { source: string };
  description: string;
  fullurl: string;
};

export class CatalogData {
  private static instance: CatalogData;
  public static loading: boolean;
  public static data: CatalogDataType[] | undefined;

  private constructor() {
    CatalogData.data = undefined;
    CatalogData.loading = true;
  }

  static getInstance(): CatalogData {
    if (CatalogData.instance) {
      CatalogData.instance = new CatalogData();
    }
    return CatalogData.instance;
  }

  static async init() {
    const catalogData = CatalogData.getInstance();
    const scientificNames = dataController.getAllScientificNames();
    CatalogData.data = await Promise.all(
      scientificNames.map((scientificName) =>
        CatalogData.getEntryData(scientificName)
      )
    );
  }

  private static async getEntryData(
    scientificName: string
  ): Promise<CatalogDataType> {
    const { usageKey: gbifUsageKey } = (
      await axios.get<{ usageKey: string }>(
        `https://api.gbif.org/v1/species/match?name=${scientificName}`
      )
    ).data;

    const { results: gbifVernacularNames } = (
      await axios.get<GBIFVernacularNamesType>(
        `https://api.gbif.org/v1/species/${gbifUsageKey}/vernacularNames?limit=10&offset=1`
      )
    ).data;

    const { results: gbifDescriptions } = (
      await axios.get<GBIFDescriptionType>(
        `https://api.gbif.org/v1/species/${gbifUsageKey}/descriptions?limit=10&offset=0`
      )
    ).data;

    const wikipediaReturnValue = (
      await axios.get<WikipediaResponseType>(
        `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${scientificName}>&gsrlimit=1&format=json&prop=pageimages%7cdescription%7cinfo&pilimit=1&pithumbsize=500&inprop=url&piprop=thumbnail`
      )
    ).data;
    const wikipediaReturnKey = Object.keys(wikipediaReturnValue.query.pages)[0];
    const wikipediaResult =
      wikipediaReturnValue.query.pages[wikipediaReturnKey];

    return {
      species: scientificName,
      usageKey: gbifUsageKey,
      vernacularName: getEnglishVernacularName(gbifVernacularNames),
      descriptions: gbifDescriptions,
      wikipediaResult,
    };
  }
}

const getEnglishVernacularName = (
  names: GBIFVernacularNamesType["results"]
): string => {
  for (const name of names) {
    if (name.language === "eng") return name.vernacularName;
  }
  return "";
};
