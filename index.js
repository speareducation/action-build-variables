const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');

const projectKey = github.context.repo.repo

const tag = github.context.ref.replace(/^refs\/(heads|tags)\//, '')
const [ , appEnv, release ] = tag.split('/');

if (!/^(sandbox|dotco|uat|staging|production)$/.test(appEnv)) {
    console.warn('appEnv could not be parsed from the ref, or it is invalid.')
}
if (!release) {
    console.warn('release could not be parsed from the ref.');
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
let packageReleaseVersion;
let packagePreReleaseVersion;
let packageIsFullRelease;
try {
    const package = require(path.resolve(process.env.GITHUB_WORKSPACE, 'package.json'));

    // Name and scope if present
    packageName = package.name;

    const nameParts = packageName.match(/^@([^/]+)?\/?(.*)$/);
    if (nameParts) {
        [ , packageScope, packagePackage ] = nameParts;
    } else {
        packagePackage = packageName;
    }

    // Version and release
    packageVersion = package.version;

    [ packageReleaseVersion, packagePreReleaseVersion ] = packageVersion.split('-');
    [ packageMajorVersion, packageMinorVersion, packagePatchVersion ] = packageReleaseVersion.split('.');

    packageIsFullRelease = packagePreReleaseVersion ? 0 : 1;
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
    packageReleaseVersion,
    packagePreReleaseVersion,
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
core.setOutput('packageReleaseVersion', packageReleaseVersion);
core.setOutput('packagePreReleaseVersion', packagePreReleaseVersion);
core.setOutput('packageIsFullRelease', packageIsFullRelease);
