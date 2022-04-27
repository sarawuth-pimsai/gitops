const core = require("@actions/core")
const github = require("@actions/github")
const { cmd } = require("../utils")

async function run() {
    try{
        const token = core.getInput("token")
        const branchRebase = core.getInput("branch_rebase")
        const branchDev = core.getInput("branch_dev")
        console.log({branchDev, branchRebase})
        const branches = await cmd('git', 'branches')
        console.log(branches)
        await cmd('git', 'checkout', `${branchDev}`)
        const branchesAfterCheckout = await cmd('git', 'branches')
        console.log(branchesAfterCheckout)
        core.setOutput("state", "value")
    }catch(error){
        core.setFailed(error)
    }
}
run()