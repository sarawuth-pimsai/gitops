const core = require("@actions/core");
const github = require("@actions/github");

try {
  const trigger = core.getInput("trigger");
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.setOutput("payload", payload);
  core.setOutput("trigger", trigger);
} catch (error) {
  core.setFailed(error.message);
}
