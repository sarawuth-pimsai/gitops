const core = require("@actions/core");
const exec = require("@actions/exec");
const eol = "\n";

const cmd = async (commandLine, ...args) => {
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
  await exec.exec(commandLine, args, options).catch((err) => {
    core.info(`The command '${commandLine} ${args.join(" ")}' failed: ${err}`);
  });
  if (errors !== "") {
    core.info(`stderr: ${errors}`);
  }
  return output;
};

async function run() {
  try {
    let branch = core.getInput("branch", { required: true }); //output hash git commit
    let branchDevelop = await cmd(`git rev-parse develop`);
    let branchMain = await cmd(`git rev-parse main`);
    if (branch === "HEAD") {
      branch = (await cmd("git", "rev-parse", "HEAD")).trim();
    }
    let lastCommitAll = (await cmd("git", "rev-list", "-n1", "--all")).trim();
    console.log("last commit all", lastCommitAll);
    let currentTag = (
      await cmd(`git tag --points-at ${branch} *[0-9].*[0-9].*[0-9]`)
    ).trim();
    console.log("current tag", currentTag);
    let logCommand = `git log --pretty="%s" --author-date-order ${branchDevelop}..${branch}`;
    const logs = await cmd(logCommand);
    console.log("logs", logs);
    const logChangedFiles = await cmd(
      `git log --name-only --oneline ${branch}`
    );
    console.log("log change files", logChangedFiles);
    let history = logs.trim().split(eol).reverse();
    console.log("history", history);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}
run();
