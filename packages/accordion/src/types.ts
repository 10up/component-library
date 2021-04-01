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
