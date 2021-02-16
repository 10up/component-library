# 10up Tooltip component

> An accessible tooltip component.

[![Support Level](https://img.shields.io/badge/support-active-green.svg)](#support-level) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![Accessibility Tests](https://github.com/10up/component-tooltip/workflows/Accessibility%20Tests/badge.svg)

## Installation

### NPM
 `npm install --save @10up/component-tooltip`

### Standalone
 Clone this repo and import `tooltip.js` and `tooltip.css` from the `dist/` directory.

## API

 This component accepts one argument, an optional callback.

### Callbacks

 - Pass in an optional function to be executed with the tooltip.

## Usage

### Markup

 This is the markup template expected by the tooltip.

 ```html
    <!--
    A Tooltip with a span
    -->

    <div>
        <span class="a11y-tip">
            <span class="a11y-tip__trigger">
                Tooltip Trigger span
            </span>

            <span class="a11y-tip__help">
                Tooltip content goes here
            </span>
        </span><!--/.a11y-tip-->
    </div>

    <!--
    A Tooltip with a link
    -->

    <div>
        <span class="a11y-tip a11y-tip--no-delay">
            <a href="#tt_id" class="a11y-tip__trigger">
                Link w/top tooltip
            </a>

            <span id="tt_id" class="a11y-tip__help a11y-tip__help--top">
                Activate this link to go somewhere!
            </span>
        </span><!--/.a11y-tip-->
    </div>

    <!--
    A Tooltip with a button
    -->

    <div>
        <span class="a11y-tip">
            <button type="button" class="a11y-tip__trigger" aria-describedby="tt_id" aria-controls="tt_id">
                Button w/bottom tooltip
            </button>

            <span id="tt_id" role="tooltip" class="a11y-tip__help a11y-tip__help--bottom">
                Buttons do things on the page. Activate it to perform an action.
            </span>
        </span><!--/.a11y-tip-->
    </div>

    <!--
    A Tooltip with an input
    -->

    <div>
        <label for="test">
            Input with right tooltip
        </label>
        <span class="a11y-tip">
            <input id="test" placeholder="enter text" class="a11y-tip__trigger" aria-describedby="test_desc" type="text">

            <span id="test_desc" role="tooltip" class="a11y-tip__help a11y-tip__help--right">
                Enter something here. Text would be fine.
            </span>
        </span><!--/.a11y-tip-->
    </div>

    <!--
    Click to show/hide tooltip
    -->

    <div>
        <span class="a11y-tip a11y-tip--toggle">
            <span class="a11y-tip__trigger">
                Tooltip Toggle Trigger
            </span>

            <span class="a11y-tip__help">
                Tooltip content goes here
            </span>
        </span><!--/.a11y-tip-->
    </div>
 ```

### CSS

 The styles can be imported into your existing codebase by using PostCSS imports, or by including the standalone CSS file in your project.

#### PostCSS Imports
 `@import '@10up/component-tooltip';`

#### Standalone
 Include the `tooltip.css` file from the `dist/` directory.

### JavaScript

 Run the tooltip with an optional callback and the correct mark up to generate the a11y tooltips.

#### NPM

```javascript
import Tooltip from '@10up/component-tooltip';


new Tooltip('.tooltip', () => {
    console.log( 'my awesome callback' );
} );
```

#### Standalone


```html
<script src="unpkg.com/@10up/component-tooltip@2.0.0/index.umd.js"></script>
```

```javascript
let myTooltip = new TenUp.tooltip('.tooltip', () => {
    console.log( 'my awesome callback' );
} );
```

## Demo

Example implementations can be found in the `demo` directory.

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850" alt="Work with us at 10up"></a>
