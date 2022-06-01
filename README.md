# Spear Education Build Variables
*Note: This action is designed to be compatible within Spear's ecosystem.

Parses the action environment

## Outputs

### `projectKey`
The repository name

### `release`
The release name, taken from the branch or tag.
Examples:
- `2021-12-01.01`
- `gl-1234`

### `appEnv`
The APP Environment, taken from the branch or tag.
Examples:
- `staging`
- `sandbox`
- `dotco`
- `production`

### `phpVersion`
The requested PHP version, taken from .pvmrc if present (default empty string)
Example: `7.4`

### `nodeVersion`
The requested Node version, taken from .nvmrc if present (default empty string)
Examples:
- `14`
- `latest`

### `packageName`
The package name from package.json if present, including scope and package
Example: `@speareducation/util`

### `packageScope`
The package scope (org) from package.json if present
Example: `speareducation`

### `packagePackage`
The package name (without scope) from package.json if present
Example: `util`

### `packageVersion`
The full project version, taken from package.json if present (default empty string)
Example: `1.2.3-beta.0`

### `packageMajorVersion`
The package major version from package.json if present (e.g. "1")
Example: `1` if packageVersion is `1.2.3`

### `packageMinorVersion`
The package minor version from package.json if present (e.g. "0")
Example: `2` if packageVersion is `1.2.3`

### `packagePatchVersion`
The package patch version from package.json if present (e.g. "0")
Example: `3` if packageVersion is `1.2.3`

### `packageReleaseVersion`
The package release version from package.json if present (e.g. "1.0.0")
Example: `1.2.3` if packageVersion is `1.2.3-beta.0`

### `packagePreReleaseVersion`
The package pre-release version from package.json if present (e.g. "pre.0")
Example: `beta.0` if packageVersion is `1.2.3-beta.0`

### `packageIsFullRelease`
Whether the package version is a full release (e.g. "1.0.0")
Example: `1` if packageVersion is `1.2.3`, `0` if packageVersion is `1.2.3-beta.0`

## Example usage
```yaml
- id: build-vars
  uses: speareducation/action-build-variables@main

- id: other-action
  env:
    release: ${{ steps.build-vars.outputs.release }}
    appEnv: ${{ steps.build-vars.outputs.appEnv }}
```

### Node setup
```yaml
# Read node version from `.nvmrc` file
- id: build-vars
  uses: speareducation/action-build-variables@main

- uses: actions/setup-node@v1
  with:
    # use the output from the action
    node-version: '${{ steps.build-vars.outputs.nodeVersion }}'
```
