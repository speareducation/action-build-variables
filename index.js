const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');

const projectKey = github.context.repo.repo

const tag = github.context.ref.replace(/^refs\/(heads|tags)\//, '')
const [ text1, appEnv, release ] = tag.split('/');

if (!/^(sandbox|dotco|uat|staging|production)$/.test(appEnv)) {
    console.warn('appEnv could not be parsed from the ref, or it is invalid.')
}
if (!release) {
    console.warn('release could not be parsed from the ref.');
}

let nodeVersion;
try {
    nodeVersion = fs.readFileSync(path.resolve(process.env.GITHUB_WORKSPACE, '.nvmrc'), 'utf8')
        .toString()
        .replace(/\s/g, '');
} catch (err) {
    nodeVersion = '14'; // Default node version
}

let packageVersion;
try {
    packageVersion = require(path.resolve(process.env.GITHUB_WORKSPACE, 'package.json')).version;
} catch (err) {
    console.warn('package.json not present, or version not set');
}

console.log({ tag, appEnv, release, projectKey, nodeVersion, packageVersion })

core.setOutput('projectKey', projectKey);
core.setOutput('appEnv', appEnv);
core.setOutput('release', release);
core.setOutput('nodeVersion', nodeVersion);
core.setOutput('packageVersion', packageVersion);
