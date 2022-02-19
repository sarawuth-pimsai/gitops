const core = require("@actions/core");
const exec = require("@actions/exec");

const cmd = async (command, ...args) => {
  let output = "";
  let errors = "";
  let options = {
    silent: true,
  };
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      errors += data.toString();
    },
    ignoreReturnCode: true,
    silent: true,
  };
  await exec.exec(command, args, options).catch((err) => {
    core.info(`The command '${command} ${args.join(" ")}' failed: ${err}`);
  });
  if (errors !== "") {
    core.info(`stderr: ${errors}`);
  }
  return output;
};
const run = async () => {
  try {
    // let branch = (await cmd("git", "rev-parse", "HEAD")).trim();
    let branch = core.getInput("branch", { required: true });
    if (branch === "HEAD") {
      branch = (await cmd("git", "rev-parse", "HEAD")).trim();
    }
    const versionPattern = "v*[0-9].*[0-9].*[0-9]";
    // validate tag
    let tag;
    try {
      tag = await cmd(
        "git",
        "describe",
        "--tags",
        "--abbrev=0",
        `--match=${versionPattern}`,
        `${branch}~1`
      );
    } catch (error) {
      tag = "";
    }
    console.log("tag: \n", tag);
    const logs = (await cmd("git", "log", "--pretty=oneline")).split("\n");
    console.log("logs: \n", logs);
    // Get root
    // Get branch
    // logs commit
    //
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
};
run();
