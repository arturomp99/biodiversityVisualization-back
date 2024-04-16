import { dataController } from "../controllers";
import axios from "axios";
import { DataType } from "./dataModel";

export type TotalCatalogInfoType = {
  totalAnimals?: number;
  totalPages?: number;
};

export type CatalogDataType = DataType & {
  species?: string;
  usageKey?: string;
  vernacularName?: string;
  descriptions?: GBIFDescriptionType["results"];
  wikipediaResult?: WikipediaResultType;
  xenoCantoResult: XenoCantoRecordingType;
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

type XenoCantoRecordingType = {
  id: string;
  get: string;
  sp: string;
  group: string;
  en: string;
  rec: string;
  cnt: string;
  loc: string;
  type: string;
  sex: string;
  stage: string;
  file: string;
  date: string;
};

type XenoCantoResponseType = {
  numRecordings: string;
  numSpecies: string;
  page: string;
  numPages: string;
  recordings: XenoCantoRecordingType[];
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
    console.log("getting catlog data...");
    const catalogData = CatalogData.getInstance();
    const observationsData = dataController.getAllData().data;
    // CatalogData.data = await Promise.all(
    //   observationsData.map((observation) =>
    //     CatalogData.getEntryData(observation)
    //   )
    // );
    for (const entry of dataController.getAllData().data) {
      CatalogData.data = [
        ...(CatalogData.data ?? []),
        await CatalogData.getEntryData(entry),
      ];
    }
    console.log("** CATALOG DATA READY **");
  }

  private static async getEntryData(
    observation: DataType
  ): Promise<CatalogDataType> {
    const scientificName = observation.scientificName;
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

    console.log(
      `fetch ${`https://xeno-canto.org/api/2/recordings?query=${scientificName.replace(
        " ",
        "+"
      )}`}`
    );
    const xenoCantoReturnValue = (
      await axios.get<XenoCantoResponseType>(
        `https://xeno-canto.org/api/2/recordings?query=${scientificName.replace(
          " ",
          "+"
        )}`
      )
    ).data;
    const xenoCantoResult =
      xenoCantoReturnValue.recordings.find(
        (recording) => recording.cnt.toLowerCase() === "singapore"
      ) ?? xenoCantoReturnValue.recordings[0];

    console.log(`${scientificName} successful`);
    return {
      ...observation,
      scientificName: scientificName,
      usageKey: gbifUsageKey,
      vernacularName: getEnglishVernacularName(gbifVernacularNames),
      descriptions: gbifDescriptions,
      wikipediaResult,
      xenoCantoResult,
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
