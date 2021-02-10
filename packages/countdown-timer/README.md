# 10up Countdown Timer component

> A countdown timer component that displays the amount of time remaining until (or elapsed since) the time specified in the component's `datetime` attribute.

[![Support Level](https://img.shields.io/badge/support-active-green.svg)](#support-level) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Build Status][cli-img]][cli-url]


[cli-img]: https://github.com/10up/component-countdown-timer/workflows/Accessibility%20Tests/badge.svg
[cli-url]: https://github.com/10up/component-countdown-timer/actions?query=workflow%3A%22Accessibility+Tests%22

## Installation

 `npm install --save @10up/countdown-timer`

[View official documentation for this package](https://baseline.10up.com/component/countdown-timer)

### Markup

 This is the markup template expected by the component. To count down to midnight on New Year's Day in the year 2046 in your local time zone:

 ```html
<time class="countdown-timer" datetime="2046-01-01T00:00:00">
	<!-- Some fallback content, perhaps the date string itself or a message to users or machines that can't view this component with JS. -->
</time>
 ```

### Usage

 Create a new instance by supplying the selector to use for the component and an object containing any necessary callback functions.

```javascript
import CountdownTimer from '@10up/countdown-timer';

new CountdownTimer( '.countdown-timer', {
	// Settings and callback properties go here.
} );
```

## Demo

Example implementations at: https://10up.github.io/component-countdown-timer/demo/

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10up.com/uploads/2016/10/10up-Github-Banner.png" width="850" alt="10up"></a>
