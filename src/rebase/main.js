const core = require("@actions/core");
const { cmd } = require("../utils");
const run = async () => {
    try {
        const headBranch = core.getInput("head_branch")
        const baseBranch = core.getInput("base_branch")
        let diffCommits = await cmd("git", "log", "--format=%H", `${baseBranch}...${headBranch}`)
        console.log(`Diff commits is ${diffCommits.length} commit`)
        console.log(diffCommits)
        const tags = await cmd("git", "describe", "--tags", "--abbrev=0", "--always");
        const commitHashBase = await cmd('git', 'rev-list', '')
        const commitHashBaseBranch = await cmd('git', 'rev-list', '-n1', `${baseBranch}`)
        const commitHashHeadBranch = await cmd('git', 'rev-list', '-n1', `${headBranch}`)
        console.log(tags)
        console.log(`Commit Hash Base: ${commitHashBase}`)
        console.log(`Commit Hash Base Branch: ${commitHashBaseBranch}`)
        console.log(`Commit Hash Head Branch: ${commitHashHeadBranch}`)
    }catch(error){
        core.error(error.message)
        core.setFailed(error.message)
    }
}

run()