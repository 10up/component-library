# 10up Reading Position component

[View official documentation for this package](https://baseline.10up.com/component/reading-position)

## Installation

`npm install @10up/reading-position --save`

## Usage

#### CSS Imports

```css
@import url("@10up/reading-position");
```

The styles can be imported into your existing codebase by using PostCSS imports, or by including the standalone CSS file in your project.

#### JavaScript

Create a new instance by supplying the selector to use for the reading-position and an object containing any necessary callback functions.

```js
import ReadingPosition from '@10up/reading-position';

new ReadingPosition( '.reading-position', {
	onCreate: function() {
		console.log( 'onCreate callback' );
	},
	scrollStart: function( percentage ) {
		console.log( 'scrollStart callback', percentage );
	},
	scrollEnd: function( percentage ) {
		console.log( 'scrollEnd callback', percentage );
	},
	scrolling: function( percentage ) {
		console.log( 'scrolling callback', percentage );
	}
} );
```

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850" alt="Work with 10up"></a>
