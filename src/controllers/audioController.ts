import { readdirSync } from "fs";
import path from "path";
import { AudioRepoType } from "../models/audioModel";

const getAudioRepo = (pathString: string): AudioRepoType[] => {
  const folders = readdirSync(pathString);
  const audioRepo = folders.map((folder) => {
    const files = readdirSync(path.join(pathString, folder));
    return {
      segment: folder,
      audio: `http://localhost:${process.env.PORT ?? "4000"}${
        process.env.AUDIO_SLUG || "/public/audio"
      }/${folder}/${files.filter((file) => path.extname(file) === ".mp3")[0]}`,
      spectrogram: `http://localhost:${process.env.PORT ?? "4000"}${
        process.env.AUDIO_SLUG || "/public/audio"
      }/${folder}/${files.filter((file) => path.extname(file) === ".jpg")[0]}`,
    };
  });
  return audioRepo;
};

export const audioController = { getAudioRepo };
