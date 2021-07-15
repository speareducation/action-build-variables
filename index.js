const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const tag = github.context.ref.replace(/^refs\/(heads|tags)\//, '')
const projectKey = github.context.repo.repo
const [ text1, appEnv, release ] = tag.split('/');

let nodeVersion = '';
try {
    nodeVersion = fs.readFileSync('.nvmrc', 'utf8').toString().replace(/\s/g, '');
} catch (err) {
    console.warn('.nvmrc not present, or version not set');
}

let packageVersion = '';
try {
    packageVersion = require('./package.json').version;
} catch (err) {
    console.warn('package.json not present, or version not set');
}

console.log({ tag, appEnv, release, projectKey, nodeVersion, packageVersion })

if (!/^(sandbox|dotco|uat|staging|production)$/.test(appEnv)) {
    core.setFailed('appEnv could not be parsed from the ref, or it is invalid.')
}
if (!release) {
    core.setFailed('release could not be parsed from the ref.');
}

core.setOutput('projectKey', projectKey);
core.setOutput('appEnv', appEnv);
core.setOutput('release', release);
core.setOutput('nodeVersion', nodeVersion);
core.setOutput('pcakageVersion', packageVersion);
