const core = require("@actions/core");
const github = require("@actions/github");

try {
  const apiToken = core.getInput("api_token");
  if (apiToken === "") {
    throw "api_token is a required input"
  }

  if (github.context.payload.pull_request) {
    const branchName = github.context.payload.pull_request.head.ref;
    const branchMatch = branchName.match(/^([iep])?(\d+)_/);

    if (branchMatch) {
      const branchModifier = branchMatch[1];
      const taskId = branchMatch[2];

      let branchType;
      let branchIgnored = false;

      switch (branchModifier) {
        case "e":
          branchType = "effort";
          break;
        case "p":
          branchType = "project";
          break;
        case "x":
          branchIgnored = true;
          break;
        default:
          branchType = "task";
      }

      core.setOutput('branch_name', branchName);
      core.setOutput('branch_type', branchType);
      core.setOutput("ignored", branchIgnored);
      core.setOutput('task_id', taskId);
    } else {
      core.info(`Skipping, branch name ${branchName} doesn't match.`);
    }
  } else {
    core.info("Skipping, context doesn't appear to be a pull request.");
  }
} catch (error) {
  core.setFailed(error.message);
}
