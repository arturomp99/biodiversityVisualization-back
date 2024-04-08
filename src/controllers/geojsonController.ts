import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export const readFolder = (path: string): string[] => {
  const files = readdirSync(path);
  const filesResponse = files.map((file) => {
    const filePath = join(path, file);
    return readGeojson(filePath);
  });
  return filesResponse;
};

const readGeojson = (filePath: string) => {
  return JSON.parse(readFileSync(filePath, "utf8"));
};
