import { readFile } from "fs/promises";

export async function readCliJsonConfig() {
  const cliJson = JSON.parse(await readFile("routeify-cli.json", "utf-8")) as {
    rootDir: string;
    projectName: string;
    entryFile: string;
  };

  return cliJson;
}
