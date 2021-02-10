/**
 * @module @10up/CountdownTimer
 *
 * @description
 *
 * A countdown timer component that displays the amount of time remaining until (or elapsed since) the time specified in the component's `datetime` attribute.
 *
 * [Link to demo]{@link https://10up.github.io/wp-component-library/component/countdown-timer/}
 */
export default class CountdownTimer {
	/**
	 * Countdown Timer main constructor function
	 *
	 * @param {string} element Selector for target elements to receive a countdown timer.
	 * @param {object} options (Optional) Object containing options. See `defaults` option for possible properties/values.
	 */
	constructor(element, options = {}) {
		const defaults = {
			onCreate: null,
			onEnd: null,
			onTick: null,
			compact: false,
			allowNegative: false,
			padValues: false,
			separator: ', ',
			showZeroes: false,
			years: {
				allowed: true,
				singular: 'year',
				plural: 'years',
			},
			weeks: {
				allowed: true,
				singular: 'week',
				plural: 'weeks',
			},
			days: {
				allowed: true,
				singular: 'day',
				plural: 'days',
			},
			hours: {
				allowed: true,
				singular: 'hour',
				plural: 'hours',
			},
			minutes: {
				allowed: true,
				singular: 'minute',
				plural: 'minutes',
			},
			seconds: {
				allowed: true,
				singular: 'second',
				plural: 'seconds',
			},
		};

		const intervals = ['years', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
		const opts = options;

		// Guard against missing or invalid or missing properties in interval options.
		intervals.forEach((interval) => {
			if (opts[interval]) {
				if (opts[interval].allowed !== false) {
					opts[interval].allowed = defaults[interval].allowed;
				}

				if (undefined === opts[interval].singular) {
					opts[interval].singular = defaults[interval].singular;
				}

				if (undefined === opts[interval].plural) {
					opts[interval].plural = defaults[interval].plural;
				}
			}
		});

		// Assign options to settings object.
		this.settings = { ...defaults, ...opts };

		this.$timers = Array.prototype.slice.call(document.querySelectorAll(element));

		if (!element || this.$timers.length === 0) {
			console.error( '10up Countdown Timer: Target not found. Please provide a valid target selector.' ); // eslint-disable-line
			return;
		}

		this.$timers.forEach((timer) => {
			this.createTimer(timer);
		});
	}

	/**
	 * Set up a countdown timer.
	 *
	 * @param {object} timer HTML element for this timer.
	 */
	createTimer(timer) {
		const tmr = timer;
		let time = new Date(tmr.getAttribute('datetime')).getTime();

		// Add a standardized class name for E2E tests.
		tmr.classList.add('tenup-countdown-timer');

		// Set role="timer" for assistive technologies, if not already set.
		if (tmr.getAttribute('role') !== 'timer') {
			tmr.setAttribute('role', 'timer');
		}

		// Give the timer a name, if it lacks one.
		if (!tmr.getAttribute('aria-label')) {
			tmr.setAttribute('aria-label', 'Countdown timer');
		}

		// Set aria-atomic="true" so that when updated, the full time will always be spoken by assistive technologies.
		tmr.setAttribute('aria-atomic', 'true');

		// Check for a valid date string in the `datetime` attribute.
		if (!time || Number.isNaN(time)) {
			console.error( '10up Countdown Timer: Time not found. Each countdown timer must have a datetime attribute with a valid date string. See https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats for details on how to build a valid date string.' ); // eslint-disable-line
			time = new Date().getTime();
		}

		// Clear fallback content.
		tmr.textContent = '';

		/**
		 * Called after a countdown timer is initialized.
		 *
		 * @callback onCreate
		 */
		if (this.settings.onCreate && typeof this.settings.onCreate === 'function') {
			this.settings.onCreate.call(this, {
				element: timer,
				time,
			});
		}

		this.createElements(tmr, time);
	}

	/**
	 * Create child elements for a tiemr.
	 *
	 * @param {object} timer HTML element for this timer.
	 * @param {number} time  Time to count down to in UNIX time.
	 */
	createElements(timer, time) {
		const span = document.createElement('span');
		const years = span.cloneNode();
		const weeks = span.cloneNode();
		const days = span.cloneNode();
		const hours = span.cloneNode();
		const minutes = span.cloneNode();
		const seconds = span.cloneNode();
		const fragment = document.createDocumentFragment();

		years.className = 'tenup-countdown-timer-years';
		years.setAttribute('aria-label', 'years');

		weeks.className = 'tenup-countdown-timer-weeks';
		weeks.setAttribute('aria-label', 'weeks');

		days.className = 'tenup-countdown-timer-days';
		days.setAttribute('aria-label', 'days');

		hours.className = 'tenup-countdown-timer-hours';
		hours.setAttribute('aria-label', 'hours');

		minutes.className = 'tenup-countdown-timer-minutes';
		minutes.setAttribute('aria-label', 'minutes');

		seconds.className = 'tenup-countdown-timer-seconds';
		seconds.setAttribute('aria-label', 'seconds');
		seconds.setAttribute('aria-hidden', 'true'); // Seconds should not be spoken by assistive technologies unless it's the highest interval.

		if (this.settings.years.allowed) {
			fragment.appendChild(years);

			if (
				this.settings.weeks.allowed ||
				this.settings.days.allowed ||
				this.settings.hours.allowed ||
				this.settings.minutes.allowed ||
				this.settings.seconds.allowed
			) {
				fragment.appendChild(document.createTextNode(this.settings.separator));
			}
		}

		if (this.settings.weeks.allowed) {
			fragment.appendChild(weeks);

			if (
				this.settings.days.allowed ||
				this.settings.hours.allowed ||
				this.settings.minutes.allowed ||
				this.settings.seconds.allowed
			) {
				fragment.appendChild(document.createTextNode(this.settings.separator));
			}
		}

		if (this.settings.days.allowed) {
			fragment.appendChild(days);

			if (
				this.settings.hours.allowed ||
				this.settings.minutes.allowed ||
				this.settings.seconds.allowed
			) {
				fragment.appendChild(document.createTextNode(this.settings.separator));
			}
		}

		if (this.settings.hours.allowed) {
			fragment.appendChild(hours);

			if (this.settings.minutes.allowed || this.settings.seconds.allowed) {
				fragment.appendChild(document.createTextNode(this.settings.separator));
			}
		}

		if (this.settings.minutes.allowed) {
			fragment.appendChild(minutes);

			if (this.settings.seconds.allowed) {
				fragment.appendChild(document.createTextNode(this.settings.separator));
			}
		}

		if (this.settings.seconds.allowed) {
			fragment.appendChild(seconds);
		}

		timer.appendChild(fragment);

		this.startTimer(timer, time, [years, weeks, days, hours, minutes, seconds]);
	}

	/**
	 * Start updating the display for the given timer elements.
	 *
	 * @param {object} timer     HTML element for this timer.
	 * @param {number} time      Time to count down to in UNIX time.
	 * @param {Array}  intervals Array of HTML elements for intervals to display.
	 */
	startTimer(timer, time, intervals) {
		// If seconds won't ever be shown, save performance by ticking once per minute.
		let delay = this.settings.seconds.allowed ? 1000 : 1000 * 60;
		let repeat;

		/**
		 * Update the timer display.
		 * This is scoped inside startTimer so that it only has access to
		 * the setInterval function that's created within this scope.
		 */
		const updateTime = () => {
			const [years, weeks, days, hours, minutes, seconds] = intervals;
			const now = new Date().getTime();
			const diff = time - now;
			const isNegative = diff < 0;
			const parsedDiff = this.formatDiff(diff, time);
			const [y, w, d, h, m, s] = parsedDiff;
			let highestNonzero;

			// Find the highest non-zero value.
			/*eslint-disable */
			parsedDiff.find((remaining, index) => {
				if (remaining > 0) {
					highestNonzero = index;
					return remaining;
				}

				if (
					highestNonzero === undefined &&
					!intervals[index].classList.contains('tenup-countdown-timer-seconds')
				) {
					// If the value of this interval is zero and there are no larger non-zero intervals, hide it from assistive technologies.
					intervals[index].setAttribute('aria-hidden', 'true');

					// If showZeroes is not enabled, remove leading zero-value intervals.
					if (!this.settings.showZeroes && timer.contains(intervals[index])) {
						if (intervals[index].nextSibling) {
							timer.removeChild(intervals[index].nextSibling);
						}

						timer.removeChild(intervals[index]);
					}
				}
			});
			/* eslint-enable */

			// If seconds are the highest non-zero interval, unhide them from assitive technologies.
			if (highestNonzero === intervals.length - 1) {
				timer.setAttribute('aria-live', 'polite');
				intervals[highestNonzero].setAttribute('aria-hidden', 'false');
			} else {
				// Only speak timer contents aloud once per minute.
				/*eslint-disable */
				if (parsedDiff[5] === 0) {
					timer.setAttribute('aria-live', 'polite');
				} else {
					timer.setAttribute('aria-live', 'off');
				}
				/* eslint-enable */
			}

			if (undefined !== highestNonzero) {
				// Hide all elements except the highest non-zero value.
				intervals.forEach((interval, index) => {
					// If there's a separator character, remove it.
					if (this.settings.compact && interval.previousSibling) {
						timer.removeChild(interval.previousSibling);
					}

					if (highestNonzero === index) {
						if (!timer.contains(interval)) {
							timer.appendChild(interval);
						}
					} else if (this.settings.compact && timer.contains(interval)) {
						timer.removeChild(interval);

						/**
						 * If we're counting up and seconds won't be shown anymore, save performance by ticking once per minute.
						 * If we're counting down, we have to keep ticking once per second to maintain an accurante countdown
						 * once we transition to seconds.
						 */
						if (
							isNegative &&
							interval.classList.contains('tenup-countdown-timer-seconds')
						) {
							delay = 1000 * 60;
						}
					}
				});
			}

			// If negative values are not allowed and the time is in the past, set everything to show 0.
			if (diff <= 0 && !this.settings.allowNegative) {
				this.updateDisplay(timer, years, 0, this.settings.years);
				this.updateDisplay(timer, weeks, 0, this.settings.weeks);
				this.updateDisplay(timer, days, 0, this.settings.days);
				this.updateDisplay(timer, hours, 0, this.settings.hours);
				this.updateDisplay(timer, minutes, 0, this.settings.minutes);
				this.updateDisplay(timer, seconds, 0, this.settings.seconds);

				// If the timer is stopped, stop ticking.
				if (repeat) {
					window.clearInterval(repeat);
				}

				/**
				 * Called after this countdown timer has reached zero.
				 *
				 * @callback onEnd
				 */
				if (this.settings.onEnd && typeof this.settings.onEnd === 'function') {
					this.settings.onEnd.call(this, {
						element: timer,
						time,
					});
				}

				return;
			}

			this.updateDisplay(timer, years, y, this.settings.years);
			this.updateDisplay(timer, weeks, w, this.settings.weeks);
			this.updateDisplay(timer, days, d, this.settings.days);
			this.updateDisplay(timer, hours, h, this.settings.hours);
			this.updateDisplay(timer, minutes, m, this.settings.minutes);
			this.updateDisplay(timer, seconds, s, this.settings.seconds);

			/**
			 * Called after the current countdown timer updates.
			 *
			 * @callback onTick
			 */
			if (this.settings.onTick && typeof this.settings.onTick === 'function') {
				this.settings.onTick.call(this, {
					element: timer,
					time,
					diff,
					isNegative,
					years: parseInt(y, 10),
					weeks: parseInt(w, 10),
					days: parseInt(d, 10),
					hours: parseInt(h, 10),
					minutes: parseInt(m, 10),
					seconds: parseInt(s, 10),
				});
			}
		};

		updateTime();

		repeat = window.setInterval(updateTime, delay);
	}

	/**
	 * Calculate the number of days, hours, minutes, and seconds from the given milliseconds.
	 *
	 * @param {number} milliseconds Number of milliseconds remaining in the countdown.
	 * @param {number} time         Time we're counting to, in milliseconds.
	 * @returns {number} null
	 */
	formatDiff(milliseconds, time) {
		const msPerSecond = 1000;
		const msPerMinute = 60 * msPerSecond;
		const msPerHour = 60 * msPerMinute;
		const msPerDay = 24 * msPerHour;
		const isNegative = milliseconds < 0;
		const now = new Date();
		const finalYear = new Date(time).getFullYear();
		const hours = Math.floor((Math.abs(milliseconds) % msPerDay) / msPerHour);
		const minutes = Math.floor((Math.abs(milliseconds) % msPerHour) / msPerMinute);
		const seconds = Math.floor((Math.abs(milliseconds) % msPerMinute) / msPerSecond);

		let years = 0;
		let weeks = 0;
		let days = Math.floor(Math.abs(milliseconds) / msPerDay);
		let yearToCheck = now.getFullYear();
		let checkYear = yearToCheck !== finalYear;

		/**
		 * Because years are not a constant number of milliseconds, we have to calculate from the number of days.
		 * Loop through each year in the diff to determine whether it's a leap year (366 days instead of 365).
		 */
		while (checkYear && days >= 365) {
			years += 1;

			if (this.isLeapYear(yearToCheck)) {
				days -= 366;
			} else {
				days -= 365;
			}

			if (isNegative) {
				yearToCheck -= 1;
			} else {
				yearToCheck += 1;
			}

			checkYear = yearToCheck !== finalYear;
		}

		/**
		 * Now that we know the total number of years in the diff, calculate the number of weeks left in the remainder.
		 * This is easier than calculating years because a week is always exactly 7 days.
		 */
		while (days >= 7) {
			days -= 7;
			weeks += 1;

			/**
			 * If the number of weeks exceeds a year, add a year and reset week counter.
			 * A year isn't *exactly* 52 weeks, but the difference within a year is small enough to ignore.
			 */
			if (weeks >= 52) {
				weeks = 0;
				years += 1;
			}
		}

		return [
			this.pad(years),
			this.pad(weeks),
			this.pad(days),
			this.pad(hours),
			this.pad(minutes),
			this.pad(seconds),
		];
	}

	/**
	 * Update the display of the given interval element.
	 *
	 * @param {object} timer    HTML element for this timer.
	 * @param {object} interval HTML element for the element to update or remove.
	 * @param {string} value    String value to display in the interval element.
	 * @param {object} label    Object containing interval label data.
	 */
	updateDisplay(timer, interval, value, label) {
		if (timer.contains(interval)) {
			// Otherwise, update the display.
			const units = value > 1 || value === 0 ? label.plural : label.singular;
			const intvl = interval;

			intvl.textContent = `${value} ${units}`;
			intvl.setAttribute('aria-label', `${value} ${units}`);
		}
	}

	/**
	 * Check if given number `n` is less than 10, and pad with a leading zero if so.
	 *
	 * @param {number} n Number to pad.
	 * @returns {number} n
	 */
	pad(n) {
		if (this.settings.padValues) {
			return n < 10 ? `0${n}` : n;
		}
		return n;
	}

	/**
	 * Check whether the given year is a leap year.
	 *
	 * @param {number} year the year being checking
	 * @returns {number} year
	 */
	isLeapYear(year) {
		return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
	}
}
