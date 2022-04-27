const core = require("@actions/core");
const { cmd } = require("../utils");

const run = async () => {
  try {
    //   let lastTags = await cmd("git", "describe", "--tags", "--abbrev=0");
    let results = await cmd(
      "git",
      "log",
      "--reverse",
      "--format=%s",
      "v2.0.0...HEAD"
    );
    console.log(results);
    let types = {
      test: [],
      fix: [],
      feat: [],
      merge: [],
    };
    let semver = {
      major: 0,
      minor: 0,
      patch: 0,
    };
    for (subject of results) {
      let check = subject.toLowerCase();
      if (/^test*\:/.test(check)) {
        types["test"].push(subject);
      } else if (/^feat+\:/.test(check)) {
        semver.minor += 1;
        semver.patch = 0;
        types["feat"].push(subject);
      } else if (/^fix+\:/.test(check)) {
        semver.patch += 1;
        types["fix"].push(subject);
      } else if (/^Merge+\:/.test(check)) {
        types["merge"].push(subject);
      }
    }
    console.log(types);
    console.log(semver);
  } catch (error) {
    core.setFailed(error.message);
  }
};
run();
