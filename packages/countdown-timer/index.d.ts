declare module '@10up/countdown-timer' {
	type IntervalOptions = {
		/**
		 * If false, this interval will not be displayed in the timer under any circumstances. Useful if you only need to show approximate values
		 * (e.g. “3 days, 12 hours since the last error”) or if you know the time you’re counting
		 * to/from falls within a certain period and you won’t need to show larger intervals like
		 * years or weeks. Note that this won’t affect the calculation of time remaining/elapsed,
		 * so if you disallow relevant intervals, the time displayed may appear inaccurate to users.
		 * Unless compact is enabled, all non-zero intervals are shown.
		 */
		allowed: boolean,
		/**
		 * Allows you to override the default singular label for the interval.
		 * Useful if you need to show the timer in a different language, or if you don’t want any labels to appear alongside the numbers.
		 * Default value: English singular form of the interval.
		 */
		singular: string,
		/**
		 * Allows you to override the default plural label for the interval.
		 * Useful if you need to show the timer in a different language, or if you don’t want any labels to appear alongside the numbers.
		 * Default value: English plural form of the interval.
		 */
		plural: string,
	}

	type CountdownTimerOptions = {
		/**
		 * Called once per component instance after the instance is initialized on page load.
		 * Called with a single argument containing the following properties: element
		 * (the top-level HTML element of the timer which invoked the callback) and
		 * time (the time this timer is counting to/from, in UNIX format).
		 */
		onCreate?: () => void,

		/**
		 * Called once per component instance when the timer reaches zero
		 * (if counting toward a future time). Called with a single argument containing the
		 * following properties: element (the top-level HTML element of the timer which invoked
		 * the callback) and time (the time this timer is counting to/from, in UNIX format).
		 * Note that this callback will never be called if the given time is in the past.
		 */
		onEnd?: () => void,

		/**
		 * Called each time a component instance updates its time (approximately once per second).
		 * More information below on this callback function.
		 */
		onTick?: () => void,

		/**
		 * If true, the timer will continue to count up once the given time has passed.
		 * This lets you display the time elapsed since a given time
		 */
		allowNegative?: boolean,

		/**
		 * If true, the timer will display only the highest non-zero interval value.
		 * This lets you display a more approximate time, e.g. 3 days. The timer will continue to tick once per second and the interval shown will change as necessary.
		 */
		compact?: boolean,

		/**
		 * If true, single-digit numbers displayed by the timer will be padded with a leading zero.
		 */
		padValues?: boolean,

		/**
		 * Define a string to be rendered between intervals.
		 */
		separator?: string,

		/**
		 * If true, all intervals will be shown,
		 * even if zero and there are no higher non-zero intervals.
		 */
		showzeroes?: boolean,

		years?: IntervalOptions,
		weeks?: IntervalOptions,
		days?: IntervalOptions,
		hours?: IntervalOptions,
		minutes?: IntervalOptions,
		seconds?: IntervalOptions,
	};

	export class CountdownTimer {
		constructor(element: string, options: CountdownTimerOptions);
		destroy(removeAttributes: boolean);
	}
}
