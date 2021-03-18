const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');

const tag = github.context.ref.replace(/^refs\/(heads|tags)\//, '')
const projectKey = path.basename(github.context.repository).replace(/\.git$/, '');

const [ text1, appEnv, release ] = tag.split('/');
console.log({ tag, appEnv, release, projectKey })


if (!/^(sandbox|dotco|uat|staging|production)$/.test(appEnv)) {
    core.setFailed('appEnv could not be parsed from the ref, or it is invalid.')
}
if (!release) {
    core.setFailed('release could not be parsed from the ref.');
}

core.setOutput('projectKey', projectKey);
core.setOutput('appEnv', appEnv);
core.setOutput('release', release);
