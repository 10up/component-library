# 10up Accordion

The most important thing to remember when implementing this accordion is that the trigger (the element you click to open a drawer) needs to be a focusable element. In this case, we’re using a button and applying all the ARIA attributes with JavaScript. If JavaScript isn’t enabled, each drawer will be in its natural open state.

## Installation

### NPM
`npm install --save @10up/component-accordion`

### Standalone
Clone this repo and import `accordion.js` and `accordion.css` from the `dist/` directory.

## API

This component accepts two arguments, the selector for the accordion container and an object containing optional callbacks.

### Callbacks

- `onCreate`: Called after the accordion is initialized on page load
- `onOpen`: Called when an accordion item is opened
- `onClose`: Called when an accordion item is closed
- `onToggle`: Called when an accordion item is toggled

## Usage

### Markup

This is the markup template expected by the component.

```html
<div class="accordion">
	<button class="accordion-header" type="button">Accordion Header</button>
	<div class="accordion-content">
		<h2 class="accordion-label">Accordion Heading</h2>
		<p>Here the content of 1st tab.</p>
	</div>
	<button class="accordion-header" type="button">Accordion Header</button>
	<div class="accordion-content">
		<h2 class="accordion-label">Accordion Heading</h2>
		<p>Here the content of 2nd tab.</p>
	</div>
</div>
```

### CSS

The styles can be imported into your existing codebase by using PostCSS imports, or by including the standalone CSS file in your project.

#### PostCSS Imports
`@import '@10up/component-accordion';`

#### Standalone
Include the `accordion.css` file from the `dist/` directory.

### JavaScript

Create a new instance by supplying the selector to use for the accordion and an object containing any necessary callback functions.

#### NPM

```javascript
import accordion from '@10up/component-accordion';

accordion( '.accordion', {
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

#### Standalone

Include the `accordion.js` file from the `dist/` directory and access the component from the gobal `TenUp` object.

```javascript
let myAccordion = new TenUp.accordion( '.accordion', {
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

An example implementation can be found in the `index.html` file in the root of this package.
