const core = require("@actions/core");
const github = require("@actions/github");
const { cmd } = require("../utils");

async function createPullRequest(token, base, head, title, body) {
  const context = github.context;
  const octokit = github.getOctokit(token);
  try {
    const response = await octokit.rest.pulls.create({
      ...context.repo,
      base,
      head,
      title,
      body
    });
    return response.data
  }catch(error) {
    return {};
  }
}
async function run() {
  try {
    const token = core.getInput("token");
    let diffCommits = await cmd("git", "log", "--format=%H", "origin/main...origin/dev")
    if(diffCommits.length === 0) return
    const tags = await cmd("git", "describe", "--tags", "--abbrev=0", "--always");
    if(tags.length === 0) throw new Error("Please create tags")
    const commitBase = await cmd("git", "rev-list", "-n1", `${tags[0]}`);
    const commitHead = await cmd("git", "rev-list", "-n1", "HEAD");
    const commitMergeBase = await cmd(
      "git",
      "merge-base",
      `-a`,
      `${commitBase[0]}`,
      `${commitHead[0]}`
    );
    let commands = [
      "git",
      "log",
      "--merges",
      "--first-parent",
      "--reverse",
      "--format='%P %s'",
    ];
    if (commitMergeBase[0] === commitHead[0]) {
      commands.push(`${commitMergeBase[0]}...${commitBase[0]}`);
    } else {
      commands.push(`${commitMergeBase[0]}...${commitHead[0]}`);
    }
    const pullRequests = await cmd(...commands);
    await cmd("git", "reset", `${commitBase[0]}`, "--hard");
    await cmd("git", "rebase", "origin/main");
    await cmd("git", "clean", "-ffdx");
    await cmd("git", "checkout", "--", ".");
    await cmd("git", "push", "--force");
    const pullRequestData = pullRequests
      .filter((r) => /\#\d+/.test(r) && /Merge pull request/.test(r))
      .map((r) => {
        const data = r.replace(/'/g, "").split(" ");
        return {
          commit: data[1],
          number: data[5].slice(1, data[5].length),
          branch: data[7].split("/").slice(1).join("/"),
        };
      });
    for (data of pullRequestData) {
      diffCommits = await cmd("git", "log", "--format=%H", `origin/dev...${data.commit}`)
      if(diffCommits.length > 0) {
        let title = `Revert "${data.branch}"`
        let body = `Reverts pull request #${data.number}`
        let revertBranch = `revert-${data.number}-${data.branch}`;
        await cmd(
          "git",
          "checkout",
          "-b",
          `${revertBranch}`,
          `${data.commit}`
        );
        await cmd(
          "git push",
          "--set-upstream",
          "origin",
          `${revertBranch}`
        );
        await createPullRequest(
          token,
          "dev",
          `${revertBranch}`,
          title,
          body
        );
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
