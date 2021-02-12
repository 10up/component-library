declare module '@10up/component-tabs' {
	type TabsOptions = {
		/**
		 * Called after the tab is initialized on page load
		 */
		onCreate?: () => void,

		/**
		 * Called when a tab item is changed
		 */
		onTabChange?: () => void,

		/**
		 * Whether the tabs are horizontal or vertical, defaults to horizontal
		 */
		orientation?: 'vertical' | 'horizontal',
	}

	export declare class Tabs {
		constructor(element: string, options: TabsOptions);
	}
}
