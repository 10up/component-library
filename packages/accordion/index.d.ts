declare module '@10up/component-accordion' {
	export type AccordionOptions = {
		/**
		 * Called after the accordion is initialized on page load.
		 */
		onCreate?: () => void,
		/**
		 * Called when an accordion item is opened
		 */
		onOpen?: () => void,
		/**
		 * Called when an accordion item is closed
		 */
		onClose?: () => void,
		/**
		 * Called when an accordion item is toggled
		 */
		onToggle?: () => void,
	};

	export class Accordion {
		constructor(element: string, options: AccordionOptions);
	}
}
