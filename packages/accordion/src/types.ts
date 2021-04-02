export interface AccordionElements {
	link: HTMLAnchorElement,
	content: HTMLElement,
	heading: HTMLElement
}

export type AccordionOptions = {
	/**
	 * Called after the accordion is initialized on page load.
	 */
	onCreate?: () => void,
	/**
	 * Called when an accordion item is opened
	 */
	onOpen?: (accordionElements?: AccordionElements) => void,
	/**
	 * Called when an accordion item is closed
	 */
	onClose?: (accordionElements?: AccordionElements) => void,
	/**
	 * Called when an accordion item is toggled
	 */
	onToggle?: (accordionElements?: AccordionElements) => void,
};
