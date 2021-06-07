# Contributing and Maintaining

First, thank you for taking the time to contribute!

The following is a set of guidelines for contributors as well as information and instructions around our maintenance process.  The two are closely tied together in terms of how we all work together and set expectations, so while you may not need to know everything in here to submit an issue or pull request, it's best to keep them in the same document.

## Ways to contribute

Contributing isn't just writing code - it's anything that improves the project.  All contributions are managed right here on GitHub. Here are some ways you can help:

### Reporting bugs

If you're running into an issue, please take a look through [existing issues](https://github.com/10up/component-library/issues) and [open a new one](https://github.com/10up/component-library/issues/new) if needed.  If you're able, include steps to reproduce, environment information, and screenshots/screencasts as relevant.

### Suggesting enhancements

New features and enhancements are also managed via [issues](https://github.com/10up/component-library/issues).

### Pull requests

Pull requests represent a proposed solution to a specified problem.  They should always reference an issue that describes the problem and contains discussion about the problem itself.  Discussion on pull requests should be limited to the pull request itself, i.e. code review.

For more on how 10up writes and manages code, check out our [10up Engineering Best Practices](https://10up.github.io/Engineering-Best-Practices/).

## Workflow

The `develop` branch is the development branch which means it contains the next version to be released. `trunk` contains the latest released version.

### Feature branches

1. From the `develop` branch create a new feature branch with the following naming structure: `feature|fix/[github-issue-number]--[branch-description]` (i.e. `feature/10--accordion-component-build`).
2. Do work on the `feature` or `fix` branch. When finished, submit a pull request to merge your work back into the `develop` branch. In the PR, link to the issue (see the sidebar options on the right).
3. If there are conflicts between your branch and the code that now exists on `develop` branch, merge `develop` into your branch to reintegrate new changes and resolve any conflicts.
4. Assign a minimum on 1 reviewer to the pull request. At least one engineer must review all PRs.
5. If any updated components (`/packages`) that will need to be relased to npm exist, be sure to update package version. numbers in their respective `package.json` files.
6. Once PR is approved, the creator of the PR performs the merge into `develop`.
7. Pull down the develop branch locally and test updates to verify everything is working correctly.


### Release instructions
_NOTE: Release is this instance is referring to the repository version history - not the npm package(s)_

1. Create a new issue in github to track the release. Name the release version in the github issue. Refer to [releases](https://github.com/10up/component-library/releases) for the latest release.
2. Create a branch from `develop` named `release/[github-issue-number]-[release-number]`.
3. With the release branch checked out locally, in the `/docs` directory run `bundle install` and `bundle exec jekyll serve.` Verify everything is working correctly.
4. Create a pull request in github to merge the `release/[github-issue-number]-[release-number]` branch into `trunk`. Assign one reviewer to the PR. Add "Component Libarary Release [release number]" to the description.
5. Once branch is approved and merged on github, switch to the `trunk` branch locally and pull the changes you just merged.
6. Verify changes are working correctly locally and, once the deploy is complete, on [Baseline](https://baseline.10up.com/components).
7. If any updated components (`/packages`) that will need to be relased to npm exist, be sure to update package version numbers in their respective `package.json` files (this should have been completed in the branch workflow - see above).
8. If any package.json files need updating, be sure to commit the updates and push to the remote `trunk` branch.
9. For all updated components (`/packages`), be sure to release these updates to npm via `npm publish [name from package.json]] [version from package.json]` (i.e. `npm publish @10up/component-accordion 2.0.1`) to release to npm.
10. Verify npm packages have been updated (i.e. [10up Accordion Component on NPM](https://www.npmjs.com/package/@10up/component-accordion)).
9. Create a new tag in the repository matching the release number (i.e. `git tag 0.1.3`).
10. Run `git push --tags` to push the newly created tag to the git repository.
11. Merge `trunk` back into develop to complete the cycle.

