# Contributing Guide

Contributing to `angularMaterializeDatePicker` is fairly easy. This document shows you how to get the project, run all provided tests and generate a production ready build.

It also covers provided gulp tasks, that help you developing on `angularMaterializeDatePicker`.

## Dependencies

To make sure that the following instructions work, please install the following dependencies on you machine:

- Node.js
- npm
- Git

## Installation

To get the source of `angularMaterializeDatePicker` clone the git repository via:

`git clone https://github.com/carlosrymer/materializecss-datepicker-directive`

This will clone the complete source to your local machine. Navigate to the project folder and install all needed dependencies via **npm**:

`npm install`

To complete the installation, install the frontend (bower) dependencies by running the following command:

`npm run bower`

Well done! You now have the directive installed and ready to be built.

## Building

`angularMaterializeDatePicker` comes with a few **gulp tasks** which help you to automate the development process. The following gulp tasks are provided:

#### gulp test

`npm test` executes (as you might thought) the unit tests, which are located in `tests.js`. The task uses the **karma** test runner to executes the tests with the **jasmine testing framework**. This task also checks the coding using **jshint**.

#### gulp build

`npm run build` updates the minified version of the code (angular-material-datepicker.min.js). It also checks the code using **jshint**.

## Contributing/Submitting changes

- Checkout a new branch based on `master` and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME
    ````
  - Use one branch per fix/feature
- Make your changes
  - Make sure to provide a spec for unit tests (in `tests.js`)
  - Run your tests with `npm test`
  - When all tests pass, everything's fine
- Commit your changes
  - Please provide a git message which explains what you've done
  - Commit to the forked repository
- Make a pull request

All PRs are attended to within a reasonable amount of time, so be sure that your contribution will receive feedback fairly quickly or be merged if immediately approved.