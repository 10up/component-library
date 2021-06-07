declare module '@10up/reading-position' {
	type ReadingPositionOptions = {
		/**
		 * Called after the reading position is initialized on page load.
		 */
		onCreate?: () => void,

		/**
		 * Called when an accordion item is opened
		 */
		scrollStart?: () => void,

		/**
		 * Called when an accordion item is closed
		 */
		scrolling?: () => void,

		/**
		 * Called when an accordion item is toggled
		 */
		scrollEnd?: () => void,

		/**
		 *  DOMNode that the percentage should start at
		 */
		startElement?: null,

		/**
		 *  DOMNode that the percentage should end at
		 */
		endElement?: null,
	}

	export type DestroyOptions = {
		/**
		 * Remove all custom attributes added by the component
		 */
		removeAttributes: boolean,
	}

	export class ReadingPosition {
		constructor(element: string, options?: ReadingPositionOptions);
		destroy(options?: DestroyOptions);
	}
}
