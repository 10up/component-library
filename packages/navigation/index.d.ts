declare module '@10up/component-navigation' {
	type NavigationOptions = {
		/**
		 * Called after the component is initialized on page load
		 */
		onCreate?: () => void,

		/**
		 * Called when a menu item is opened
		 */
		onEnd?: () => void,

		/**
		 * Called when a menu item is closed
		 */
		onClose?: () => void,

		/**
		 * Called when a submenu item is opened
		 */
		onSubmenuOpen?: () => void,

		/**
		 * Called when a submenu item is closed
		 */
		onSubmenuClose?: () => void,

		/**
		 * The action to use to open menu items (default) hover
		 */
		action?: 'click' | 'hover',
	}

	export class Navigation {
		constructor(element: string, options: NavigationOptions);
	}
}
