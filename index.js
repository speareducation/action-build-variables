// TODO: refactor all save-state / set-output to the new format:
//     find => echo "::set-output name={name}::{value}"
//     replace => echo "{name}={value}" >> $GITHUB_OUTPUT
// See: https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');

const projectKey = github.context.repo.repo

const tag = github.context.ref.replace(/^refs\/(heads|tags)\//, '')
const [ , appEnv, release ] = tag.split('/');

if (!/^(dev|development|qa|sandbox|dotco|uat|staging|production)$/.test(appEnv)) {
    console.warn('appEnv could not be parsed from the ref, or it is invalid.')
}
if (!release) {
    console.warn('release could not be parsed from the ref.');
}

let dockerRegistry = '';
let dockerBaseImage = '';
try {
    buildconfig = fs.readFileSync(path.resolve(process.env.GITHUB_WORKSPACE, '.buildconfig'), 'utf8')
        .split('\n')
        .reduce((carry, entry) => {
            let [key, value] = entry.split('=', 1);
            carry[key] = value;
            return { ...carry, [key]: value };
        }, {});
    dockerRegistry = buildconfig.DOCKER_REGISTRY;
    dockerBaseImage = `${dockerRegistry}/${buildconfig.DOCKER_BASE_IMAGE_NAME}:${buildconfig.DOCKER_BASE_IMAGE_VER}`;

} catch (err) {
}

let phpVersion;
try {
    phpVersion = fs.readFileSync(path.resolve(process.env.GITHUB_WORKSPACE, '.pvmrc'), 'utf8')
        .toString()
        .replace(/\s/g, '');
} catch (err) {
    phpVersion = '';
}

let nodeVersion;
try {
    nodeVersion = fs.readFileSync(path.resolve(process.env.GITHUB_WORKSPACE, '.nvmrc'), 'utf8')
        .toString()
        .replace(/\s/g, '');
} catch (err) {
    nodeVersion = '16'; // Default node version
}

let packageName;
let packageScope;
let packagePackage;
let packageVersion;
let packageMajorVersion;
let packageMinorVersion;
let packagePatchVersion;
let packagePreVersion;
let packageIsFullRelease;
try {
    const packageJson = require(path.resolve(process.env.GITHUB_WORKSPACE, 'package.json'));

    // Name and scope if present
    packageName = packageJson.name;

    const nameParts = packageName.match(/^@([^/]+)?\/?(.*)$/);
    if (nameParts) {
        [, packageScope, packagePackage] = nameParts;
    } else {
        packagePackage = packageName;
    }

    // Version and release
    packageVersion = packageJson.version;

    [packagePatchVersion, packagePreVersion] = packageVersion.split('-');

    const versionParts = packagePatchVersion.split('.');
    [packageMajorVersion] = versionParts;
    packageMinorVersion = versionParts.slice(0, 2).join('.');

    packageIsFullRelease = packagePreVersion ? 0 : 1;
} catch (err) {
    console.warn('package.json not present, or version not set');
}

console.log('action-build-variables', {
    tag,
    appEnv,
    release,
    projectKey,
    phpVersion,
    nodeVersion,
    packageName,
    packageScope,
    packagePackage,
    packageVersion,
    packageMajorVersion,
    packageMinorVersion,
    packagePatchVersion,
    packagePreVersion,
    packageIsFullRelease,
});

core.setOutput('projectKey', projectKey);
core.setOutput('appEnv', appEnv);
core.setOutput('release', release);
core.setOutput('phpVersion', phpVersion);
core.setOutput('nodeVersion', nodeVersion);
core.setOutput('packageName', packageName);
core.setOutput('packageScope', packageScope);
core.setOutput('packagePackage', packagePackage);
core.setOutput('packageVersion', packageVersion);
core.setOutput('packageMajorVersion', packageMajorVersion);
core.setOutput('packageMinorVersion', packageMinorVersion);
core.setOutput('packagePatchVersion', packagePatchVersion);
core.setOutput('packagePreVersion', packagePreVersion);
core.setOutput('packageIsFullRelease', packageIsFullRelease);
core.setOutput('dockerRegistry', dockerRegistry);
core.setOutput('dockerBaseImage', dockerBaseImage);
