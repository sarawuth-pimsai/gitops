const core = require("@actions/core");
const exec = require("@actions/exec");
const eol = "\n";

const cmd = async (commandLine, ...args) => {
  let output = "";
  let errors = "";
  let options = {
    silent: true,
  };
  options.listenners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      errors += data.toString();
    },
  };
  await exec.exec(commandLine, args, options).catch((err) => {
    core.info(`The command '${command} ${args.join(" ")}' failed: ${err}`);
  });
  if (errors !== "") {
    core.info(`stderr: ${errors}`);
  }
};

async function run() {
  try {
    let branch = core.getInput("branch", { required: true });
    if (branch === "HEAD") {
      result = await exec.exec("git", "rev-parse", "develop");
      console.log(result);
    }
    // console.log(branch);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
