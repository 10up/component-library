import { throttle } from 'throttle-debounce';
import 'core-js/features/array/from';
import 'core-js/web/dom-collections';
import 'element-closest-polyfill';

/**
 * Create Navigation
 */
export default class CreateNavigation {
	/**
	 * Constructor
	 *
	 * @param {string} navSelector Selector for navigation element
	 * @param {object} options for optional changes to the menu and adding a menu button
	 */
	constructor(navSelector, options = {}) {
		const defaults = {
			navButtonElement: true, // button selector to open/close navigation, true to simply get button from id of navSelector
			subMenuElement: '.sub-menu', // submenu selector
			activeClass: 'active', // class added to li menu item when submenu considered "opened"
			breakpoint: '768px', // accepts true for always mobile, false for always desktop or any css unit
			desktopHover: true, // allow hover events on top level items for hover-capable devices
			autoCloseMenu: true, // close mobile menu when clicking elsewhere. if string given it wont close unless that selector is a parent of what was clicked
			onInit: null, // function after menu is instantiated
			onMenuOpen: null, // function for when menu is opened. param passed is the menu button that opened it
			onMenuClose: null, // function for when menu is closed. param passed is the menu button that closed it
			onSubMenuOpen: null, // function for after a submenu opened. Params passed are the submenu and the menu item that holds the submenu
			onSubMenuClose: null, // function for after a submenu closed. Params passed are the submenu and the menu item that holds the submenu
			onResize: null, // runs when menu is resized.
		};

		// unique id allows for multiple instances without issue
		this.instance = CreateNavigation.instances++;

		// check and set whether js is disabled
		document.querySelector('html').classList.remove('no-js');
		document.querySelector('html').classList.add('js');

		// setup properties
		this.menuToggle = null;
		this.navSelector = navSelector;
		this.navElement = document.querySelector(this.navSelector);

		if (this.navElement === null) {
			console.error('Nav menu is not found on this page'); // eslint-disable-line
		}

		this.menuItems = this.navElement.querySelectorAll('li');
		this.options = { ...defaults, ...options };
		this.breakpoint = this.options.breakpoint;
		this.subMenus = this.getSubMenus();
		this.topLevelItems = this.getTopLevelItems();

		// bind events so they work properly and can be removed if destroyed
		this.resize = this.resize.bind(this);
		this.hoverOnEvent = this.hoverOnEvent.bind(this);
		this.hoverOffEvent = this.hoverOffEvent.bind(this);
		this.clickEvents = this.clickEvents.bind(this);
		this.focusOutEvent = this.focusOutEvent.bind(this);
		this.focusInEvent = this.focusInEvent.bind(this);
		this.throttleResize = throttle(400, false, this.resize);

		if (this.options.navButtonElement) {
			this.menuToggleEvent = this.menuToggleEvent.bind(this);
		}

		this.setup();
	}

	/**
	 * Sets up the menu system and calls various functions
	 */
	setup() {
		// Add aria attributes to submenus and unique ID's
		this.setupSubmenus();

		// optionally add a button to open/close menu.
		// creates a menu button with aria attributes and click event for open/close
		if (this.options.navButtonElement) {
			this.setupMenuToggle();
		}

		this.setupEvents();
		this.resize();

		if (this.options.onInit && typeof this.options.onInit === 'function') {
			this.options.onInit.call();
		}
	}

	setupEvents() {
		// Hover events for desktop top level menu items only
		if (this.menuItems.length !== 0 && this.options.desktopHover) {
			this.navElement.addEventListener('mouseenter', this.hoverOnEvent, true);
			this.navElement.addEventListener('mouseleave', this.hoverOffEvent, true);
		}

		document.body.addEventListener('click', this.clickEvents);
		this.navElement.addEventListener('focusout', this.focusOutEvent);
		this.navElement.addEventListener('focusin', this.focusInEvent);

		// resize event check for submenus off screen and fix, changes menu to vertical if necessary
		window.addEventListener('resize', this.throttleResize);
	}

	/**
	 * Destroy instance
	 *
	 * @param {object} options for how to destroy
	 */
	destroy(options = {}) {
		this.removeAllEventListeners();

		const defaults = {
			removeAttributes: true,
		};

		const settings = {
			...defaults,
			...options,
		};

		if (settings.removeAttributes) {
			if (this.menuToggle) {
				this.menuToggle.removeAttribute('aria-hidden');
				this.menuToggle.removeAttribute('aria-expanded');
				this.menuToggle.removeAttribute('aria-pressed');
			}

			this.subMenus.forEach((subMenu) => {
				const menuItem = subMenu.closest('li');
				const anchor = menuItem.querySelector('a');
				menuItem.classList.remove('js-has-submenu'); // add class to let us know this has a submenu. dont rely on wordpress classes
				menuItem.classList.remove('js-top-level-item');
				menuItem.classList.remove('active');
				subMenu.removeAttribute('aria-label');
				subMenu.removeAttribute('aria-hidden');
				anchor.removeAttribute('aria-controls');
				anchor.removeAttribute('aria-haspopup');
			});
		}
	}

	/**
	 * Removes all event listeners
	 */
	removeAllEventListeners() {
		this.navElement.removeEventListener('mouseenter', this.hoverOnEvent, true);
		this.navElement.removeEventListener('mouseleave', this.hoverOffEvent, true);
		document.body.removeEventListener('click', this.clickEvents);
		this.navElement.removeEventListener('focusout', this.focusOutEvent); // eslint-disable-line

		window.removeEventListener('resize', this.throttleResize);
	}

	/**
	 * Adds and removes a class of horizontal-menu on desktop for easy styling.
	 * Good to add horizontal-menu manually in markup, just in case there is no js.
	 * with .no-js horizontal-menu goes mobile at 768px.
	 * Otherwise this class is added and removed making it go vertical/horizontal and ignores that default media query
	 */
	setOrientation() {
		if (!this.isMobile()) {
			this.navElement.classList.add('horizontal-menu');
		} else {
			this.navElement.classList.remove('horizontal-menu');
		}
	}

	/**
	 * Gets all submenus in this nav
	 *
	 * @returns {boolean|Element} of all submenus
	 */
	getSubMenus() {
		if (this.navElement !== null) {
			return this.navElement.querySelectorAll(this.options.subMenuElement);
		}
		return false;
	}

	/**
	 * Returns top level items in an array
	 *
	 * @returns {Element[]} top level elements
	 */
	getTopLevelItems() {
		const firstLiFound = this.navElement.querySelector('li');
		const topLevelItems = Array.from(firstLiFound.parentNode.children);

		topLevelItems[topLevelItems.length - 1].dataset.lastMenuItem = '';
		topLevelItems.forEach((item) => {
			item.classList.add('js-top-level-item');
		});

		return topLevelItems;
	}

	/**
	 * Adds the proper ADA compliant attributes and id's for each submenu
	 */
	setupSubmenus() {
		if (this.subMenus.length > 0) {
			this.subMenus.forEach((subMenu, index) => {
				const menuItem = subMenu.closest('li');
				const anchor = menuItem.querySelector('a');
				menuItem.classList.add('js-has-submenu'); // add class to let us know this has a submenu

				if (!subMenu.hasAttribute('id')) {
					subMenu.setAttribute('id', `submenu-${this.instance}-${index}`);
				}
				subMenu.setAttribute('aria-label', 'Submenu');
				subMenu.setAttribute('aria-hidden', 'true');

				anchor.setAttribute('aria-controls', subMenu.getAttribute('id'));
				anchor.setAttribute('aria-haspopup', 'true');
			});
		}
	}

	/**
	 * Creates proper code for the button element chosen. It will open the menu on click or enter
	 * Element to be toggle must have an ID and this menu button must have an aria-controls that equals that ID
	 *
	 * This element does not have to be the navigation. it can be anything.
	 */
	setupMenuToggle() {
		// backwards compatibility allows button to automatically be set to target the navigation element only
		if (this.options.navButtonElement === true) {
			const menuId = this.navElement.getAttribute('id');
			if (!menuId) {
				console.error(
					'You must ad an ID to your navigation to use with your button. Or change the option of navButtonElement to a button element selector.',
				);
			}
			this.menuToggle = document.querySelector(`[aria-controls="${menuId}"`);
		} else {
			this.menuToggle = document.querySelector(this.options.navButtonElement);
		}

		if (!this.menuToggle.hasAttribute('aria-controls')) {
			// eslint-disable-next-line no-console
			console.error(
				'You have added a button to use to toggle this navigation. Therefore you must have a navigation element to open/close. Please give this button an aria-controls attribute that has a value pointing to an id. The id would be the element we are opening and closing.',
			); // eslint-disable-line
			return;
		}

		// Provide default label if none found
		if (!this.menuToggle.hasAttribute('aria-label')) {
			this.menuToggle.setAttribute('aria-label', 'Menu Button');
		}

		this.menuToggle.setAttribute('aria-hidden', `${!this.isMobile()}`);

		// presume it begins closed
		this.menuToggle.setAttribute('aria-expanded', 'false');
		this.menuToggle.setAttribute('aria-pressed', 'false');

		// add toggle event to menu button
		this.menuToggle.addEventListener('click', this.menuToggleEvent);
	}

	menuToggleEvent() {
		if (this.menuToggle.getAttribute('aria-expanded') === 'false') {
			this.openMenu();
		} else {
			this.closeMenu();
		}
	}

	/**
	 * Opens a menu when a menu button is clicked
	 */
	openMenu() {
		this.menuToggle.setAttribute('aria-expanded', 'true');
		this.menuToggle.setAttribute('aria-pressed', 'true');
		this.openItem(this.menuToggle);
		if (this.options.onMenuOpen && typeof this.options.onMenuOpen === 'function') {
			this.options.onMenuOpen.call(this, this.menuToggle);
		}
	}

	/**
	 * Closes a menu when a menu button is clicked
	 */
	closeMenu() {
		this.menuToggle.setAttribute('aria-expanded', 'false');
		this.menuToggle.setAttribute('aria-pressed', 'false');
		this.closeItem(this.menuToggle);
		if (this.options.onMenuClose && typeof this.options.onMenuClose === 'function') {
			this.options.onMenuClose.call(this, this.menuToggle);
		}
	}

	/**
	 * Based on the breakpoint provided we return whether we are on mobile or not
	 *
	 * @returns {boolean} if this menu is considered mobile based on breakpoint
	 */
	isMobile() {
		let { breakpoint } = this; // assuming we have a pixel or rem size

		// always in mobile mode
		if (breakpoint === true) {
			return true;
		}

		// always desktop mode
		if (breakpoint === false) {
			return false;
		}

		if (breakpoint.includes('min-width')) {
			return !matchMedia(`${breakpoint}`).matches;
		}

		if (breakpoint.includes('max-width')) {
			return matchMedia(`${breakpoint}`).matches;
		}

		// using a css variable
		if (this.breakpoint.includes('--')) {
			breakpoint = getComputedStyle(document.documentElement).getPropertyValue(breakpoint);
		}

		return matchMedia(`(max-width: ${breakpoint}`).matches;
	}

	/**
	 * Checks if the menu is horizontal by testing flex direction
	 * Helpful
	 *
	 * @returns {boolean} if menu is using flex and direction is row returns true
	 */
	isMenuHorizontal() {
		const firstLiFound = this.navElement.querySelector('li').parentElement;
		const style = getComputedStyle(firstLiFound);
		const display = style.getPropertyValue('display');
		const direction = style.getPropertyValue('flex-direction');
		return direction !== 'column' && display === 'flex';
	}

	/**
	 * Opens another item from this elements aria-controls attribute
	 *
	 * @param controlElement element with an aria-controls attribute. Will set that element to open (false)
	 *
	 */
	openItem(controlElement) {
		document
			.querySelector(`#${controlElement.getAttribute('aria-controls')}`)
			.setAttribute('aria-hidden', 'false');
	}

	/**
	 * Closes another item from this elements aria-controls attribute
	 *
	 * @param controlElement element with an aria-controls attribute. Will set that element to closed (true)
	 */
	closeItem(controlElement) {
		document
			.querySelector(`#${controlElement.getAttribute('aria-controls')}`)
			.setAttribute('aria-hidden', 'true');
	}

	/**
	 * Closes all menu items and submenus
	 *
	 * @param excludeMenuItem exclude an item from being closed
	 */
	closeAllMenuItems(excludeMenuItem = null) {
		if (this.subMenus.length !== 0) {
			this.subMenus.forEach((submenu) => {
				if (excludeMenuItem === null || !submenu.contains(excludeMenuItem)) {
					submenu.setAttribute('aria-hidden', 'true');
				}
			});
		}

		if (this.menuItems.length !== 0) {
			this.menuItems.forEach((item) => {
				if (
					excludeMenuItem === null ||
					(excludeMenuItem !== item && !item.contains(excludeMenuItem))
				) {
					item.classList.remove(this.options.activeClass);
					item.classList.remove('clicked-open');
				}
			});
		}
	}

	/**
	 * On Resize of browser we change menu button aria from hidden/visible
	 * We also set the menu aria to visible on desktop and on mobile only hide if menu button is not currently active
	 */
	resize() {
		this.setOrientation();
		// if there is a navbutton we should change its aria-hidden
		if (this.options.navButtonElement && this.menuToggle !== null) {
			this.menuToggle.setAttribute('aria-hidden', `${!this.isMobile()}`);

			// if resize goes desktop, the menu's aria-hidden should be false
			// if its mobile and the menu toggle is not expanded, close menu and menu items
			if (!this.isMobile()) {
				this.openItem(this.menuToggle);
			} else if (
				this.isMobile() &&
				this.menuToggle.getAttribute('aria-expanded') === 'false'
			) {
				this.closeItem(this.menuToggle);
				this.closeAllMenuItems();
			}
		}

		this.fixSubmenus();

		if (this.options.onResize && typeof this.options.onResize === 'function') {
			this.options.onResize.call(this, this.isMobile());
		}
	}

	/**
	 * on resize check if desktop and check if menus, when open would be off screen. if so add class
	 */
	fixSubmenus() {
		// if mobile simply remove and return
		// expect mobile site to be vertical and no need to check for offscreen menus
		if (this.isMobile()) {
			this.topLevelItems.forEach((item) => {
				item.classList.remove('submenu-offscreen-right');
				item.classList.remove('submenu-offscreen-left');
			});
			return;
		}

		this.topLevelItems.forEach((item) => {
			// get top level element
			const topSubMenu = item.querySelector(this.options.subMenuElement);

			if (topSubMenu) {
				// make item visible so we can get left edge quick
				const { display } = window.getComputedStyle(topSubMenu);
				if (display !== 'block') {
					topSubMenu.style.display = 'block';
				}
				const rightEdge = topSubMenu.getBoundingClientRect().right;
				const leftEdge = topSubMenu.getBoundingClientRect().left;

				// set menu back to initial display value
				if (display !== 'block') {
					topSubMenu.style.removeProperty('display');
				}

				const viewport = document.documentElement.clientWidth;
				// if the submenu is off the page, pull it back somewhat by using a class
				if (rightEdge > viewport) {
					topSubMenu.closest('li').classList.remove('submenu-offscreen-left');
					topSubMenu.closest('li').classList.add('submenu-offscreen-right');
					return;
				}

				if (leftEdge < 0) {
					topSubMenu.closest('li').classList.remove('submenu-offscreen-right');
					topSubMenu.closest('li').classList.add('submenu-offscreen-left');
					return;
				}

				// if its not offscreen reset and remove classes
				topSubMenu.closest('li').classList.remove('submenu-offscreen-right');
				topSubMenu.closest('li').classList.remove('submenu-offscreen-left');
			}
		});
	}

	/**
	 * Desktop Hover On
	 *
	 * @param e event
	 */
	hoverOnEvent(e) {
		const menuItem = e.target.closest(
			`${this.navSelector} li.js-has-submenu.js-top-level-item`,
		);
		if (menuItem === null || this.isMobile()) {
			return;
		}

		if (
			!menuItem.classList.contains('clicked-open') &&
			!menuItem.classList.contains('active')
		) {
			this.closeAllMenuItems(menuItem); // wont close this item or its parent
			this.openSubMenu(menuItem);
		}
	}

	/**
	 * Desktop Hover Off
	 *
	 * @param e event
	 */
	hoverOffEvent(e) {
		const menuItem = e.target.closest(
			`${this.navSelector} li.js-has-submenu.js-top-level-item`,
		);

		if (menuItem === null || menuItem !== e.target || this.isMobile()) {
			return;
		}

		if (!menuItem.classList.contains('clicked-open')) {
			this.closeSubMenu(menuItem);
		}
	}

	/**
	 * Click events
	 *
	 * @param e event
	 */
	clickEvents(e) {
		if (this.menuItems.length === 0) {
			return;
		}

		// if clicking off the entire menu, close submenus on desktop
		if (!e.target.closest(`${this.navSelector}`) && !this.isMobile()) {
			this.closeAllMenuItems();
		}

		// if a button is being used to show/hide the menu then clicking off the button and menu holder, assuming there is one, closes menu
		if (
			this.options.autoCloseMenu &&
			this.menuToggle !== null &&
			this.menuToggle.getAttribute('aria-hidden') === 'false' &&
			!e.target.closest(`${this.options.navButtonElement}`) &&
			!e.target.closest(`#${this.menuToggle.getAttribute('aria-controls')}`)
		) {
			if (
				typeof this.options.autoCloseMenu === 'string' ||
				this.options.autoCloseMenu instanceof String
			) {
				if (e.target.closest(`${this.options.autoCloseMenu}`)) {
					this.closeMenu();
				}
			} else {
				this.closeMenu();
			}
		}

		// Opening a sub menu with a click when appropriate
		// on mobile,  on desktop when hover is turned off, or if the anchor is href="#"
		const menuItem = e.target.closest(`${this.navSelector} li.js-has-submenu`);
		if (menuItem) {
			if (!this.options.desktopHover || this.isMobile() || e.target.closest(`a[href="#"]`)) {
				e.preventDefault();
				if (!menuItem.classList.contains('clicked-open')) {
					if (this.isMenuHorizontal()) {
						this.closeAllMenuItems(menuItem);
					}
					menuItem.classList.add('clicked-open');
					this.openSubMenu(menuItem);
				} else {
					menuItem.classList.remove('clicked-open');
					this.closeSubMenu(menuItem);
				}
			}
		}
	}

	/**
	 * Focus off menu event
	 */
	focusOutEvent() {
		setTimeout(() => {
			if (!this.navElement.contains(document.activeElement) && !this.isMobile()) {
				this.closeAllMenuItems();
			}
		}, 100);
	}

	focusInEvent(e) {
		const menuItem = e.target.closest(`${this.navSelector} li.js-has-submenu`);
		if (menuItem) {
			this.closeAllMenuItems(menuItem);
			this.openSubMenu(menuItem);
		} else {
			this.closeAllMenuItems();
		}
	}

	/**
	 * Open Submenu
	 *
	 * @param menuItem li parent element of submenu
	 */
	openSubMenu(menuItem) {
		menuItem.classList.add('active');
		if (menuItem.classList.contains('js-has-submenu')) {
			const subMenu = menuItem.querySelector(`${this.options.subMenuElement}`);
			subMenu.setAttribute('aria-hidden', 'false');

			if (this.options.onSubMenuOpen && typeof this.options.onSubMenuOpen === 'function') {
				this.options.onSubMenuOpen.call(this, menuItem, subMenu);
			}
		}
	}

	/**
	 * Close Submenu
	 *
	 * @param menuItem li parent element of submenu
	 */
	closeSubMenu(menuItem) {
		menuItem.classList.remove('active');
		if (menuItem.classList.contains('js-has-submenu')) {
			const subMenu = menuItem.querySelector(`${this.options.subMenuElement}`);
			subMenu.setAttribute('aria-hidden', 'true');

			if (this.options.onSubMenuClose && typeof this.options.onSubMenuClose === 'function') {
				this.options.onSubMenuClose.call(this, menuItem, subMenu);
			}
		}
	}
}

CreateNavigation.instances = 0;
