import 'core-js/es/array/from';
import 'core-js/web/dom-collections';

/**
 * @module TenUpNavigation
 *
 * @description
 *
 * Create responsive navigation.
 */
export default class Navigation {
	/**
	 * constructor method
	 *
	 * @param {string} element Element selector for navigation container.
	 * @param {object} options Object of optional callbacks.
	 */
	constructor(element, options = {}) {
		// Defaults
		const defaults = {
			action: 'hover',
			toggleWithArrows: false,
			breakpoint: '(min-width: 48em)',

			// Event callbacks
			onCreate: null,
			onOpen: null,
			onClose: null,
			onSubmenuOpen: null,
			onSubmenuClose: null,
		};

		if (!element || typeof element !== 'string') {
			console.error( '10up Navigation: No target supplied. A valid target (menu) must be used.' ); // eslint-disable-line
			return;
		}

		this.evtCallbacks = {};

		// bind methods
		this.setMQ = this.setMQ.bind(this);
		this.listenerMenuToggleClick = this.listenerMenuToggleClick.bind(this);
		this.listenerSubmenuAnchorFocus = this.listenerSubmenuAnchorFocus.bind(this);
		this.listenerSubmenuAnchorClick = this.listenerSubmenuAnchorClick.bind(this);
		this.listenerDocumentClick = this.listenerDocumentClick.bind(this);
		this.listenerDocumentKeyup = this.listenerDocumentKeyup.bind(this);

		// Settings
		this.settings = { ...defaults, ...options };

		// Set media queries.
		this.mq = window.matchMedia(this.settings.breakpoint);

		// Menu container selector.
		this.$menu = document.querySelector(element);

		// Bail out if there's no menu.
		if (!this.$menu) {
			console.error( '10up Navigation: Target not found. A valid target (menu) must be used.' ); // eslint-disable-line
			return;
		}

		this.$menuToggle = document.querySelector(
			`[aria-controls="${this.$menu.getAttribute('id')}"]`,
		);

		// Also bail early if the toggle isn't set.
		if (!this.$menuToggle) {
			console.error( '10up Navigation: No menu toggle found. A valid menu toggle must be used.' ); // eslint-disable-line
			return;
		}

		// Set all submenus and menu items.
		this.$submenus = this.$menu.querySelectorAll('ul');
		this.$menuItems = this.$menu.querySelectorAll('li');

		// Update the html element classes for styles.
		// Otherwise it'll fallback to :target.
		document.querySelector('html').classList.remove('no-js');
		document.querySelector('html').classList.add('js');

		// Setup tasks
		this.setupMenu();
		this.setupDropdownArrows();
		this.setupSubMenus();
		this.setupListeners();

		/**
		 * Called after the component is initialized on page load.
		 *
		 * @callback onCreate
		 */
		if (this.settings.onCreate && typeof this.settings.onCreate === 'function') {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Handle destroying tabs
	 *
	 * @param options Optional options
	 */
	destroy(options = {}) {
		this.removeAllEventListeners();
		this.mq.removeListener(this.setMQ);

		const defaults = {
			removeAttributes: true,
		};

		const settings = {
			...defaults,
			...options,
		};

		if (settings.removeAttributes) {
			this.$menu.removeAttribute('aria-hidden');
			this.$menu.removeAttribute('data-action');
			this.$menu.removeAttribute('data-arrows');
			this.$menuToggle.removeAttribute('aria-expanded');
			this.$menuToggle.removeAttribute('aria-hidden');

			this.$submenus.forEach(($submenu) => {
				const $anchor = this.getToggleElement($submenu, 'anchor');
				const $toggleButton = this.getToggleElement($submenu, 'button');

				if ($toggleButton instanceof HTMLElement) {
					$toggleButton.remove();
				}

				$submenu.removeAttribute('id');
				$submenu.removeAttribute('aria-hidden');

				// Update ARIA.
				$submenu.removeAttribute('aria-label');
				$anchor.removeAttribute('aria-controls');
				$anchor.removeAttribute('aria-haspopup');
				$anchor.removeAttribute('aria-expanded');
			});
		}
	}

	/**
	 * Adds an event listener and caches the callback for later removal
	 *
	 * @param {element} element The element associaed with the event listener
	 * @param {string} evtName The event name
	 * @param {Function} callback The callback function
	 */
	addEventListener(element, evtName, callback) {
		if (typeof this.evtCallbacks[evtName] === 'undefined') {
			this.evtCallbacks[evtName] = [];
		}

		this.evtCallbacks[evtName].push({
			element,
			callback,
		});

		element.addEventListener(evtName, callback);
	}

	/**
	 * Removes all event listeners
	 */
	removeAllEventListeners() {
		Object.keys(this.evtCallbacks).forEach((evtName) => {
			const events = this.evtCallbacks[evtName];
			events.forEach(({ element, callback }) => {
				element.removeEventListener(evtName, callback);
			});
		});
	}

	/**
	 * Sets up the main menu for the navigation.
	 * Includes adding classes and ARIA.
	 * We use "scoped" classes so we can be more confident that there will be no collisions.
	 *
	 */
	setupMenu() {
		const id = this.$menu.getAttribute('id');
		const href = this.$menuToggle.getAttribute('href');
		const hrefTarget = href.replace('#', '');

		this.$menu.dataset.action = this.settings.action;
		this.$menu.dataset.arrows = this.settings.toggleWithArrows;

		// Check for a valid ID on the menu.
		if (!id || id === '') {
			console.error( '10up Navigation: Target (menu) must have a valid ID attribute.' ); // eslint-disable-line
			return;
		}

		// Check that the menu toggle is set to use the menu for fallback.
		if (hrefTarget !== id) {
			console.warn( '10up Navigation: The menu toggle href and menu ID are not equal.' ); // eslint-disable-line
		}

		// Update ARIA.
		this.$menuToggle.setAttribute('aria-controls', hrefTarget);

		// Sets up ARIA tags related to screen size based on our media query.
		this.setMQMenuA11y();
	}

	/**
	 * Sets up the submenus.
	 * Adds JS classes and initial AIRA attributes.
	 */
	setupSubMenus() {
		this.$submenus.forEach(($submenu, index) => {
			const $anchor = this.getToggleElement($submenu, 'anchor');
			const submenuID = `tenUp-submenu-${index}`;

			$submenu.setAttribute('id', submenuID);

			// Update ARIA.
			$submenu.setAttribute('aria-label', 'Submenu');
			$anchor.setAttribute('aria-controls', submenuID);
			$anchor.setAttribute('aria-haspopup', true);
			$anchor.setAttribute('aria-expanded', false);

			// Sets up ARIA tags related to screen size based on our media query.
			this.setMQSubbmenuA11y();
		});
	}

	/**
	 * Create HTML nodes for the dropdown arrows that can be clicked.
	 * This is only used if toggleWithArrows is true.
	 */
	setupDropdownArrows() {
		if (this.settings.toggleWithArrows === false) {
			return;
		}

		this.$submenus.forEach(($submenu) => {
			// Create the dropdown button element and all it's properties we need:
			const $toggleButton = document.createElement('button');

			$toggleButton.classList.add('sub-menu-toggle');
			$toggleButton.setAttribute('type', 'button');
			$toggleButton.setAttribute('aria-label', 'Toggle sub menu items');

			// We want to add the arrows next to the link.
			$submenu.parentNode.insertBefore($toggleButton, $submenu);
			this.addEventListener($toggleButton, 'click', this.listenerSubmenuAnchorClick);
		});
	}

	/**
	 * Binds our various listeners for the plugin.
	 * Includes specific element listeners as well as media query.
	 */
	setupListeners() {
		// Media query listener.
		// We're using this instead of resize + debounce because it should be more efficient than that combo.
		this.mq.addListener(this.setMQ);

		// Menu toggle listener.
		this.addEventListener(this.$menuToggle, 'click', this.listenerMenuToggleClick);

		// Submenu listeners.
		// Mainly applies to the anchors or buttons of submenus.
		// If we have buttons for clickable element, it is still just before the submenu.
		this.$submenus.forEach(($submenu) => {
			const $dropdownTrigger = $submenu.previousElementSibling;

			if (this.settings.action === 'hover') {
				this.addEventListener($dropdownTrigger, 'focus', this.listenerSubmenuAnchorFocus);
			}

			if (this.settings.action === 'click' && this.settings.toggleWithArrows === false) {
				// Regular click on top level will open drodpdown when toggleWithArrows === false
				this.addEventListener($dropdownTrigger, 'click', this.listenerSubmenuAnchorClick);
			}
		});

		// Document specific listeners.
		// Mainly used to close any open menus.
		this.addEventListener(document, 'click', this.listenerDocumentClick);
		this.addEventListener(document, 'keyup', this.listenerDocumentKeyup);
	}

	/**
	 * Set
	 */

	/**
	 * Sets an media query related functions when the query boundry is reached.
	 *
	 */
	setMQ() {
		this.setMQMenuA11y();
		this.setMQSubbmenuA11y();
	}

	/**
	 * Sets any ARIA that changes as a result of the media query boundry being passed.
	 * Specifically for the toggle and main menu.
	 *
	 */
	setMQMenuA11y() {
		// Large
		if (this.mq.matches) {
			this.$menu.setAttribute('aria-hidden', false);
			this.$menuToggle.setAttribute('aria-expanded', true);
			this.$menuToggle.setAttribute('aria-hidden', true);
			// Small
		} else {
			this.$menu.setAttribute('aria-hidden', true);
			this.$menuToggle.setAttribute('aria-expanded', false);
			this.$menuToggle.setAttribute('aria-hidden', false);
		}
	}

	/**
	 * Sets an media query related functions when the query boundry is reached.
	 * Specifically for submenus.
	 *
	 */
	setMQSubbmenuA11y() {
		this.$submenus.forEach(($submenu) => {
			$submenu.setAttribute('aria-hidden', true);
		});
	}

	/**
	 * Get
	 */

	/**
	 * Simplify targeting action element with the different toggle options.
	 *
	 * @param {object} $submenu HTMLElement selector of the submenu
	 * @param {string} type anchor|button based on what is needed
	 * @returns {object} HTMLElement for the desired target.
	 */
	getToggleElement($submenu, type = 'anchor') {
		if ($submenu instanceof HTMLElement === false) {
			console.error(
				'10up Navigation: first parameter ($submenu) of getToggleElement() is not an instance of HTMLElement',
			);

			return null;
		}

		if (type === 'anchor') {
			if (this.settings.toggleWithArrows === false) {
				return $submenu.previousElementSibling;
			}

			return $submenu.previousElementSibling.previousElementSibling;
		}

		if (type === 'button') {
			if (this.settings.toggleWithArrows === false) {
				return null;
			}

			return $submenu.previousElementSibling;
		}

		// Shouldn't get this far, but to remove an ESLint notice:
		return null;
	}

	/**
	 * Opens the passed submenu.
	 *
	 * @param   {element} $submenu The submenu to open. Required.
	 */
	openSubmenu($submenu) {
		// Open the submenu by updating ARIA and class.
		$submenu.setAttribute('aria-hidden', false);

		/**
		 * Called when a submenu item is opened.
		 *
		 * @callback onSubmenuOpen - optional.
		 */
		if (this.settings.onSubmenuOpen && typeof this.settings.onSubmenuOpen === 'function') {
			this.settings.onSubmenuOpen.call();
		}
	}

	/**
	 * Closes the passed submenu.
	 *
	 * @param   {element} $submenu The submenu to close. Required.
	 */
	closeSubmenu($submenu) {
		const $anchor = this.getToggleElement($submenu, 'anchor');
		const $toggleButton = this.getToggleElement($submenu, 'button');
		const $childSubmenus = $submenu.querySelectorAll('li > .sub-menu[aria-hidden="false"]');

		if ($toggleButton instanceof HTMLElement) {
			$toggleButton.setAttribute('aria-expanded', false);
		}

		// Close the submenu by updating ARIA and class.
		$submenu.setAttribute('aria-hidden', true);

		if ($childSubmenus) {
			// Close any children as well.
			// Update their ARIA and class.
			this.closeSubmenus($childSubmenus);
		}

		if (!this.mq.matches) {
			$anchor.focus();
		}

		/**
		 * Called when a submenu item is closed.
		 *
		 * @callback onSubmenuClose - optional.
		 */
		if (this.settings.onSubmenuClose && typeof this.settings.onSubmenuClose === 'function') {
			this.settings.onSubmenuClose.call();
		}
	}

	/**
	 * Closes all submenus in the node list.
	 *
	 * @param  {Array} $submenus The node list of submenus to close. Required.
	 */
	closeSubmenus($submenus) {
		$submenus.forEach(($submenu) => {
			this.closeSubmenu($submenu);
		});
	}

	/**
	 * Listeners
	 */

	/**
	 * Menu toggle handler.
	 * Opens or closes the menu according to current state.
	 *
	 * @param {object} event The event object.
	 */
	listenerMenuToggleClick(event) {
		const isExpanded = this.$menuToggle.getAttribute('aria-expanded') === 'true';

		// Don't act like a link.
		event.preventDefault();

		// Don't bubble.
		event.stopPropagation();

		// Is the menu currently open?
		if (isExpanded) {
			// Update ARIA
			this.$menu.setAttribute('aria-hidden', true);
			this.$menuToggle.setAttribute('aria-expanded', false);

			/**
			 * Called when a menu item is closed.
			 *
			 * @callback onClose - optional
			 */
			if (this.settings.onClose && typeof this.settings.onClose === 'function') {
				this.settings.onClose.call();
			}
		} else {
			// Update ARIA
			this.$menu.setAttribute('aria-hidden', false);
			this.$menuToggle.setAttribute('aria-expanded', true);

			// Focus the first link in the menu
			this.$menu.querySelectorAll('a')[0].focus();

			/**
			 * Called when a menu item is opened.
			 *
			 * @callback onOpen - optional
			 */
			if (this.settings.onOpen && typeof this.settings.onOpen === 'function') {
				this.settings.onOpen.call();
			}
		}
	}

	/**
	 * Document click handler.
	 * Closes all open submenus on a click outside of the menu.
	 *
	 */
	listenerDocumentClick() {
		const $openSubmenus = this.$menu.querySelectorAll('.sub-menu[aria-hidden="false"]');

		// Bail if no submenus are found.
		if ($openSubmenus.length === 0) {
			return;
		}

		// Close the submenus.
		this.closeSubmenus($openSubmenus);
	}

	/**
	 * Document keyup handler.
	 * Closes all open menus on a escape key.
	 * Refocuses after closing submenus.
	 *
	 * @param   {object} event The event object.
	 */
	listenerDocumentKeyup(event) {
		const $openSubmenus = this.$menu.querySelectorAll('.sub-menu[aria-hidden="false"]');

		// Bail early if not using the escape key or if no submenus are found.
		if ($openSubmenus.length === 0 || event.keyCode !== 27) {
			return;
		}

		// Close submenus
		this.closeSubmenus($openSubmenus);

		// If we're set to click, set the focus back.
		if (this.settings.action === 'click') {
			$openSubmenus[0].previousElementSibling.focus();
		}
	}

	/**
	 * Submenu anchor click handler.
	 * Opens or closes the submenu accordingly.
	 * Only fires based on settings and if the media query is appropriate.
	 *
	 * @param   {object} event The event object. Required.
	 */
	listenerSubmenuAnchorClick(event) {
		const $anchor = event.target;
		const $submenu = $anchor.nextElementSibling;
		const isHidden = $submenu.getAttribute('aria-hidden') === 'true';

		let $openSubmenus = this.$menu.querySelectorAll('.sub-menu[aria-hidden="false"]');

		$openSubmenus = Array.from($openSubmenus).filter((menu) => !menu.contains($anchor));

		// Close the submenus.
		this.closeSubmenus($openSubmenus);

		// Bail if set to hover and we're on a large screen.
		if (this.settings.action === 'hover' && this.mq.matches) {
			return;
		}

		// Don't let the link act like a link.
		if (this.settings.toggleWithArrows === false) {
			event.preventDefault();
		}

		// Don't bubble.
		event.stopPropagation();

		// Is the submenu hidden?
		if (isHidden) {
			// Yes, open it.
			this.openSubmenu($submenu);
			$anchor.setAttribute('aria-expanded', true);
		} else {
			// No, close it.
			this.closeSubmenu($submenu);
			$anchor.setAttribute('aria-expanded', false);
		}
	}

	/**
	 * Submenu anchor focus handler.
	 * Opens or closes the submenu accordingly.
	 * Only fires based on settings and if the media query is appropriate.
	 *
	 * @param   {object} event The event object.
	 */
	listenerSubmenuAnchorFocus(event) {
		const $anchor = event.target;
		const $menuItem = $anchor.parentNode;
		const $submenu = $anchor.nextElementSibling;
		const $childSubmenus = $menuItem.parentNode.querySelectorAll('.sub-menu');

		// Bail early if no submenu is found or if we're on a small screen.
		if (!$submenu || !this.mq.matches) {
			return;
		}

		// Close all sibling menus
		this.closeSubmenus($childSubmenus);

		// Open this menu
		this.openSubmenu($submenu);
	}
}
