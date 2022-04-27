import { getExecOutput } from "@actions/exec";
import { info } from "@actions/core";

const fs = require("fs");

export async function cmd(commandLine, ...args) {
  info(`The command ${commandLine} ${args.join(" ")}`);
  const options = { ignoreReturnCode: true, silent: true };
  const output = await getExecOutput(commandLine, args, options);
  // console.log(output)
  if (output.exitCode > 0) throw new Error(output.stderr);
  return output.stdout.split("\n").filter((o) => o !== "");
}
export async function writeFile(outputPath, data) {
  await fs.writeFile(outputPath, data, { mode: 0o640, flag: "wx" });
  return outputPath;
}
