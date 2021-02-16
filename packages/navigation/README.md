# 10up Navigation component

> An accessible and responsive navigation component.

[![Support Level](https://img.shields.io/badge/support-active-green.svg)](#support-level) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![Accessibility Tests](https://github.com/10up/component-navigation/workflows/Accessibility%20Tests/badge.svg)

## Installation

### NPM
 `npm install --save @10up/component-navigation`

### Standalone
 Clone this repo and import `navigation.js` and `navigation.css` from the `dist/` directory.

## API

 This component accepts two arguments, the selector for the navigation container and an object containing configuration settings and optional callbacks.

### Settings

 - `action`: The action to use to open menu items _(default) **hover**_
 - `breakpoint`: Viewport breakpoint to switch to small screen menu _(default) **(min-width: 48em)**_

### Callbacks

 - `onCreate`: Called after the component is initialized on page load
 - `onOpen`: Called when a menu item is opened
 - `onClose`: Called when a menu item is closed
 - `onSubmenuOpen`: Called when a submenu item is opened
 - `onSubmenuClose`: Called when a submenu item is closed

## Usage

### Markup

 This is the markup template expected by the component.

 ```html
<nav class="site-navigation" role="navigation" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement">

	<a href="#primary-nav" aria-controls="primary-nav">
		<span class="screen-reader-text">Primary Menu</span>
		<span aria-hidden="true">☰</span>
	</a>

	<?php
		wp_nav_menu( array(
			'theme_location' => 'primary',
			'menu_class'     => 'primary-menu',
			'menu_id'        => 'primary-nav',
			) );
	?>

</nav>
 ```

### CSS

 The styles can be imported into your existing codebase by using PostCSS imports, or by including the standalone CSS file in your project.

#### PostCSS Imports
 `@import '@10up/component-navigation';`

#### Standalone
 Include the `navigation.css` file from the `dist/` directory.

### JavaScript

 Create a new instance by supplying the selector to use for the navigation and an object containing any necessary configuration settings and callback functions.

#### NPM

```javascript
import Navigation from '@10up/component-navigation';

new Navigation( '.navigation', {
	action: 'click',
	onCreate: function() {
		console.log( 'onCreate callback' );
	},
	onOpen: function() {
		console.log( 'onOpen callback' );
	},
	onClose: function() {
		console.log( 'onClose callback' );
	},
	onSubmenuOpen: function() {
		console.log( 'onSubmenuOpen callback' );
	},
	onSubmenuClose: function() {
		console.log( 'onSubmenuClose callback' );
	}
} );
```

#### Standalone

Include the `navigation.js` file from the `dist/` directory and access the component from the gobal `TenUp` object.

```javascript
let myNavigation = new TenUp.navigation( '.navigation', {
	action: 'click',
	onCreate: function() {
		console.log( 'onCreate callback' );
	},
	onOpen: function() {
		console.log( 'onOpen callback' );
	},
	onClose: function() {
		console.log( 'onClose callback' );
	},
	onSubmenuOpen: function() {
		console.log( 'onSubmenuOpen callback' );
	},
	onSubmenuClose: function() {
		console.log( 'onSubmenuClose callback' );
	}
} );
```

## Demo

Example implementations can be found in the `demo` directory.

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850" alt="10up"></a>
