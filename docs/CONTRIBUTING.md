# Contributing

Currently contributing is limited to the OkayHQ team. Please file an issue ticket if you run into any bugs or issues and we'll get back to you as soon as possible!

## Publishing
### Set up your account (one time)
1. Create or login to your NPM account & enable 2FA. You must be a member of the okayhq org to publish this package.
1. On your local machine, run `npm adduser` to link your npm account

### Publish a new package to NPM
1. Bump the package version in package.json. Create a PR, get it approved, and merge to main.
    ```
    ...
    "version": "0.0.2",
    ...
    ```
1. Create a new release in github corresponding to the package.json version
1. On your local machine, run `git checkout main && git fetch origin main && git reset --hard origin/main`
1. Run `npm publish --access public` to publish the current version to NPM. You’ll be asked for your 2FA code. Confirm the new version has been pushed: https://www.npmjs.com/package/@okayhq/backstage-plugin