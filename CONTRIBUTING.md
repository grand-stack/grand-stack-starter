# Contributing to GraphQl Architect

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Contributor License Agreement](#contributor-license-agreement)
- [Code Organization](#code-organization)
- [Setting Up the project locally](#setting-up-the-project-locally)
- [Local Development for Desktop](#local-development-for-desktop)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Add yourself as a contributor](#add-yourself-as-a-contributor)

## Code of Conduct

We have a code of conduct you can find [here](./CODE_OF_CONDUCT.md) and every
contributor is expected to obey the rules therein. Any issues or PRs that don't
abide by the code of conduct may be closed.

## Code Organization

Check out the [overview in readme](./CONTRIBUTING#overview) for the structure of the project.

**Working on your first Pull Request?** You can learn how from this _free_
series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Setting Up the project locally

To install the project you need to have `node` and `npm` installed

1.  [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone
    your fork:

    ```sh
    # Clone your fork
    git clone https://github.com/<your-username>/graphql-architect.git

    # Navigate to the newly cloned directory
    cd graphql-architect
    ```

2.  from the root of the project: `npm install` all dependencies
    - make sure you have latest `npm` version
3.  from the root of the project: `npm start`

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```sh
> git remote add upstream https://github.com/grand-stack/graphql-architect
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," then
> fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `master` branch.
> Whenever you want to update your version of `master`, do a regular `git pull`.

## Local Development

Grandstack Architect can be built and developed one of two ways: Through the web app process and
into a package that can be added directly to neo4j desktop. While the web app portion works in an
aesthetic/theoretical sense most of the complexity and usability is currently focused on the built
application.

### Building for Desktop

To build the app and test it in development in desktop you will need to

1. Install [Neo4j Desktop](https://neo4j.com/download/)
2. Pack the app with `npm run pack:dev` or `npm run pack`
3. Drag and drop the packed tarball into Neo4j Desktop

### Running the Web App

```sh
$ npm run start
```

## Submitting a Pull Request

Please go through existing issues and pull requests to check if somebody else is
already working on it, we use `someone working on it` label to mark such issues.

`husky` will run type checking, prettier and a linter before you are allowed to commit
but you may run these commands seperately

```sh
npm test
npm run lint
npm run format
```

## Add yourself as a contributor

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
