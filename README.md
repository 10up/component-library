# 10up Component Library

> A library of barebones front-end components built with WordPress and accessibility in mind.

[![Support Level](https://img.shields.io/badge/support-active-green.svg)](#support-level) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/10up/component-library/branch/develop/graph/badge.svg?token=rm4ggtw19O)](https://codecov.io/gh/10up/component-library)


## Overview

At 10up, we strive to provide websites that yield a top-notch user experience. In order to improve both our efficiency and consistency, we need to standardize what we use and how we use it. Standardizing our approach to commonly-used front-end components allows us to understand better the inner workings of someone else’s project and produce better solutions for ourselves and our clients.

Each component in this library is built with simplicity and accessibility in mind, tailored to fit the often opinionated nature of WordPress core output. These components are intended to be easily adapted to any number of different projects and use cases.

All components are tested to be WCAG 2.1 Compliant.

**[Start browsing ☞](https://10up.github.io/wp-component-library/)**

## How to Use

To use a component, navigate to the component’s detail page to see demos, usage examples, and installation instructions.

## Components

* [Accordion](packages/accordion/README.md)
* [Animate](packages/animate/README.md)
* [Countdown Timer](packages/countdown-timer/README.md)
* [Navigation](packages/navigation/README.md)
* [Tabs](packages/tabs/README.md)
* [Tooltip](packages/tooltips/README.md)

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Repository Structure and Engineering Guidelines
Visit the [CONTRIBUTING](/CONTRIBUTING.md) page for initial contribution and engineering guidance.

This repository is broken into four parts. Within each part, there is an included README.md file that contains additinal pertinent engineering guidelines and instructions:

* [packages](/packages): The UI components and scripts that are distributed as an NPM package, and test/demo pages for each component.

* [test-utils](/test-utils): This is currently a work in progress.

* [e2e](/e2e): Testing suite for packages. Includes all package components for local testing.

* [docs](/docs): The public facing documentation site. Includes codebase utilizng Jekyll to construct site. Pulls componets from latest release on npm.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850" alt="10up"></a>
