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

### `nodeVersion`
The requested Node version, taken from .nvmrc if present (default empty string)
Examples:
- `14`
- `latest`

### `packageVersion`
The project version, taken from package.json if present (default empty string)
Example: `1.2.3`

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
