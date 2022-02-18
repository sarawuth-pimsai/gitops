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
};

async function run() {
  try {
    let branch = core.getInput("branch", { required: true });
    if (branch === "HEAD") {
      result = (await cmd("git", "rev-parse", "HEAD")).trim();
      console.log(result);
    }
    // console.log(branch);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}
run();
