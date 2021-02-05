# 10up Accordion component

[![Support Level](https://img.shields.io/badge/support-active-green.svg)](#support-level) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Build Status][cli-img]][cli-url]

[cli-img]: https://github.com/10up/component-accordion/workflows/Automated%20Tests/badge.svg
[cli-url]: https://github.com/10up/component-accordion/actions?query=workflow%3A%22Automated+Tests%22

[View official documentation for this package](https://baseline.10up.com/component/accordion)

## Installation

`npm install --save @10up/component-accordion`

## Usage

#### CSS Imports

`@import url("@10up/component-accordion");`

The styles can be imported into your existing codebase by using PostCSS imports, or by including the standalone CSS file in your project.

#### JavaScript

Create a new instance by supplying the selector to use for the accordion and an object containing any necessary callback functions.

```javascript
import Accordion from '@10up/component-accordion';

new Accordion( '.accordion', {
	onCreate: function() {
		console.log( 'onCreate callback' );
	},
	onOpen: function() {
		console.log( 'onOpen callback' );
	},
	onClose: function() {
		console.log( 'onClose callback' );
	},
	onToggle: function() {
		console.log( 'onToggle callback' );
	}
} );
```

## Demo

Example implementations at: https://10up.github.io/accordion-animate/demo/

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850"></a>
