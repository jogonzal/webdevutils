/* eslint-disable no-console */
// https://effectivetypescript.com/2020/10/20/tsprune/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

export interface IPruneInfo {
  modulesThatNeedPruning: string[];
  numberOfModules: number;
}

export function getPruneInfo(): IPruneInfo {
  // Concatenate both files
  const fileContent = fs.readFileSync("./pruneoutput.txt", "utf-8");
  const fileContentNoInclude = fs.readFileSync(
    "./pruneoutputNoInclude.txt",
    "utf-8"
  );
  let fileContentSplitByNewLine = [
    ...fileContent.split("\n"),
    ...fileContentNoInclude.split("\n"),
  ];
  // Remove duplicates
  fileContentSplitByNewLine = [...new Set(fileContentSplitByNewLine)];
  // Locales are dynamic imports, so they shouldn't be considered
  fileContentSplitByNewLine = fileContentSplitByNewLine.filter(
    (line: string) =>
      line.length > 0 && line.indexOf("\\src\\loc\\locales\\") === -1
  );
  const modulesThatNeedPruning = fileContentSplitByNewLine.filter(
    (line: string) => line.indexOf("used in module") === -1
  );
  return {
    modulesThatNeedPruning,
    numberOfModules: fileContentSplitByNewLine.length,
  };
}

export function printPruneInfo(pruneInfo: IPruneInfo): void {
  console.warn(
    `There are ${pruneInfo.numberOfModules} modules, of which ${pruneInfo.modulesThatNeedPruning.length} are unused`
  );
  for (const module of pruneInfo.modulesThatNeedPruning) {
    console.error(module);
  }
}
