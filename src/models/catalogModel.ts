import { dataController } from "../controllers";
import axios from "axios";
import { DataType } from "./dataModel";

export type TotalCatalogInfoType = {
  totalAnimals?: number;
  totalPages?: number;
};

export type CatalogDataType = DataType & {
  species?: string;
  molInfo?: MOLResult;
  xenoCantoResult?: XenoCantoRecordingType;
  wikipediaResult?: WikipediaResultType;
  gbifVernacularName?: GBIFVernacularNamesType["results"][0];
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

type MOLResult = {
  info: [
    {
      content: string;
      source: string;
      lang: string;
    }
  ];
  rangemap: string;
  family: [{ lang: string; name: string }];
  taxa: string;
  commonname: string;
  redlist_link: string;
  scientificname: string;
  image: { url: string };
};

type WikipediaResultType = {
  pageId: number;
  title: string;
  thumbnail: { source: string };
  description: string;
  fullurl: string;
};

type WikipediaResponsePageType = {
  pageId: number;
  title: string;
  thumbnail: { source: string };
  description: string;
  fullurl: string;
};

type WikipediaResponseType = {
  query: {
    pages: {
      [key: string]: WikipediaResponsePageType;
    };
  };
};

type GBIFVernacularNamesType = {
  results: { vernacularName: string; language: string }[];
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
    console.log("arturo molInfo", scientificName.replace(" ", "+"));
    const molInfo = (
      await axios.get<MOLResult[]>(
        `https://api.mol.org/1.x/species/info?scientificname=${scientificName.replace(
          " ",
          "+"
        )}`
      )
    ).data;
    // Backup
    let wikipediaResult: WikipediaResponsePageType | undefined = undefined;
    let gbifVernacularName: GBIFVernacularNamesType["results"][0] | undefined =
      undefined;
    if (!molInfo[0]) {
      const wikipediaReturnValue = (
        await axios.get<WikipediaResponseType>(
          `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${scientificName}>&gsrlimit=1&format=json&prop=pageimages%7cdescription%7cinfo&pilimit=1&pithumbsize=500&inprop=url&piprop=thumbnail`
        )
      ).data;
      console.log("arturo return wikipediaReturnValue", wikipediaReturnValue);

      const wikipediaReturnKey = Object.keys(
        wikipediaReturnValue?.query.pages
      )[0];
      wikipediaResult = wikipediaReturnValue.query.pages[wikipediaReturnKey];
      console.log("arturo return wikipediaResult", wikipediaResult);

      const { usageKey: gbifUsageKey } = (
        await axios.get<{ usageKey: string }>(
          `https://api.gbif.org/v1/species/match?name=${scientificName}`
        )
      ).data;
      console.log("arturo return gbifUsageKey", gbifUsageKey);
      const { results: gbifVernacularNamesResult } = (
        await axios.get<GBIFVernacularNamesType>(
          `https://api.gbif.org/v1/species/${gbifUsageKey}/vernacularNames?limit=10&offset=1`
        )
      ).data;
      console.log(
        "arturo return gbifVernacularNamesResult",
        gbifVernacularNamesResult
      );
      gbifVernacularName = gbifVernacularNamesResult.find(
        (name) => name.language === "eng"
      );
      console.log("arturo return gbifVernacularName", gbifVernacularName);
    }

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
      molInfo: molInfo[0],
      xenoCantoResult,
      wikipediaResult,
      gbifVernacularName,
    };
  }
}
