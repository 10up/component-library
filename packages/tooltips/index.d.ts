declare module '@10up/component-tooltip' {
	type TooltipOptions = {
		/**
		 * Called after the tooltip is initialized
		 */
		onCreate?: () => void,

		/**
		 * Called when the tooltip opens
		 */
		onOpen?: () => void,

		/**
		 * Called when the tooltip closes
		 */
		onClose?: () => void,
	}

	export declare class Tooltip {
		constructor(element: string, options: TooltipOptions);
	}
}
