const core = require("@actions/core")
const github = require("@actions/github")

async function run() {
    try{
        const token = core.getInput("token")
        const context = github.context
        const octokit = github.getOctokit(token)
        const output = {
            title: 'Output test result by annotations',
            summary: 'There are 0 failures, 2 warnings, and 1 notices.',
            text: 'You may have some misspelled words on lines 2 and 4. You also may want to add a section in your README about how to install your app.',
            annotations: [
              {
                path: 'README.md',
                annotation_level: 'warning',
                title: 'Spell Checker',
                message: 'Check your spelling for \'banaas\'.',
                raw_details: 'Do you mean \'bananas\' or \'banana\'?',
                start_line: 2,
                end_line: 2
              },
              {
                path: 'README.md',
                annotation_level: 'warning',
                title: 'Spell Checker',
                message: 'Check your spelling for \'aples\'',
                raw_details: 'Do you mean \'apples\' or \'Naples\'',
                start_line: 4,
                end_line: 4
              }
            ],
            images: [
              {
                alt: 'กองสลากพลัส',
                image_url: 'https://play-lh.googleusercontent.com/78yPQt8yk0XcO7xBCpKL326gs670ZzLB2GLXquJv7snIRDWncLasy0ZACn4NIYN4fKI'
              }
            ]
          }
        // let createResponse = await octokit.rest.checks.create({...context.repo})
        // note: status: completed and conclusion https://github.com/sarawuth-pimsai/flowreopen/runs/6076269415?check_suite_focus=true
        const name = "work flow"
        let createResponse = await octokit.rest.checks.create({
            head_sha: context.payload.head_commit.id,
            name,
            conclusion: 'success',
            status: 'completed',
            output,
            ...github.context.repo});
        console.log("Create Response")
        console.log(createResponse)
        let response = await octokit.rest.checks.listForRef({...context.repo, ref:"main"})
        console.log("Response")
        console.log(response.data)
    }catch(error){
        console.log(error)
        core.error(error)
        core.setFailed(error)
    }
}
run()