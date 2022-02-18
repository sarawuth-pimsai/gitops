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
    if (branch === "HEAD") {
      branch = (await cmd("git", "rev-parse", "HEAD")).trim();
    }
    let lastCommitAll = (await cmd("git", "rev-list", "-n1", "--all")).trim();
    console.log("last commit all");
    console.log(lastCommitAll);
    let currentTag = (
      await cmd(`git tag --points-at ${branch} *[0-9].*[0-9].*[0-9]`)
    ).trim();
    console.log("current tag");
    console.log(currentTag);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}
run();
