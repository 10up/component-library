'use strict';

/**
 * @module TenUpNavigation
 *
 * @description
 *
 * Create responsive navigation.
 */
export default class TenUpNavigation {

	/**
	 * constructor method
	 * @param {string} element Element selector for navigation container.
	 * @param {Object} options Object of optional callbacks.
	 */
	constructor( element, options = {} ) {

		// Defaults
		const defaults = {

			action: 'hover',
			breakpoint: '(min-width: 48em)',

			// Event callbacks
			onCreate: null,
			onOpen: null,
			onClose: null,
			onSubmenuOpen: null,
			onSubmenuClose: null,
		};

		if ( ! element || 'string' !== typeof element ) {
			console.error( '10up Navigation: No target supplied. A valid target (menu) must be used.' ); // eslint-disable-line
			return;
		}

		// Settings
		this.settings = Object.assign( {}, defaults, options );

		// Set media queries.
		this.mq = window.matchMedia( this.settings.breakpoint );

		// Menu container selector.
		this.$menu = document.querySelector( element );

		// Bail out if there's no menu.
		if ( ! this.$menu ) {
			console.error( '10up Navigation: Target not found. A valid target (menu) must be used.' ); // eslint-disable-line
			return;
		}

		this.$menuToggle = document.querySelector( `[aria-controls="${this.$menu.getAttribute( 'id' )}"]` );

		// Also bail early if the toggle isn't set.
		if ( ! this.$menuToggle ) {
			console.error( '10up Navigation: No menu toggle found. A valid menu toggle must be used.' ); // eslint-disable-line
			return;
		}

		// Set all submenus and menu items.
		this.$submenus = this.$menu.querySelectorAll( 'ul' );
		this.$menuItems = this.$menu.querySelectorAll( 'li' );

		// Update the html element classes for styles.
		// Otherwise it'll fallback to :target.
		document.querySelector( 'html' ).classList.remove( 'no-js' );
		document.querySelector( 'html' ).classList.add( 'js' );

		// Setup tasks
		this.setupMenu();
		this.setupSubMenus();
		this.setupListeners();

		/**
		 * Called after the component is initialized on page load.
		 * @callback onCreate
		 */
		if ( this.settings.onCreate && 'function' === typeof this.settings.onCreate ) {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Setup
	 */

	/**
	 * Sets up the main menu for the navigation.
	 * Includes adding classes and ARIA.
	 * We use "scoped" classes so we can be more confident that there will be no collisions.
	 *
	 * @returns {null}
	 */
	setupMenu() {

		const id = this.$menu.getAttribute( 'id' );
		const href = this.$menuToggle.getAttribute( 'href' );
		const hrefTarget = href.replace( '#', '' );

		this.$menu.dataset.action = this.settings.action;

		// Check for a valid ID on the menu.
		if ( ! id || '' === id ) {
			console.error( '10up Navigation: Target (menu) must have a valid ID attribute.' ); // eslint-disable-line
			return;
		}

		// Check that the menu toggle is set to use the menu for fallback.
		if ( hrefTarget !== id ) {
			console.warn( '10up Navigation: The menu toggle href and menu ID are not equal.' ); // eslint-disable-line
		}

		// Update ARIA.
		this.$menuToggle.setAttribute( 'aria-controls', hrefTarget );

		// Sets up ARIA tags related to screen size based on our media query.
		this.setMQMenuA11y();
	}

	/**
	 * Sets up the submenus.
	 * Adds JS classes and initial AIRA attributes.
	 *
	 * @returns {null}
	 */
	setupSubMenus() {

		this.$submenus.forEach( ( $submenu, index ) => {
			const $anchor    = $submenu.previousElementSibling;
			const submenuID  = `tenUp-submenu-${index}`;

			$submenu.setAttribute( 'id', submenuID );

			// Update ARIA.
			$submenu.setAttribute( 'aria-label', 'Submenu' );
			$anchor.setAttribute( 'aria-controls', submenuID );
			$anchor.setAttribute( 'aria-haspopup', true );

			// Sets up ARIA tags related to screen size based on our media query.
			this.setMQSubbmenuA11y();
		} );
	}

	/**
	 * Binds our various listeners for the plugin.
	 * Includes specific element listeners as well as media query.
	 *
	 * @returns {null}
	 */
	setupListeners() {
		const comp = this;
		// Media query listener.
		// We're using this instead of resize + debounce because it should be more efficient than that combo.
		this.mq.addListener( this.setMQ.bind( comp ) );

		// Menu toggle listener.
		this.$menuToggle.addEventListener( 'click', this.listenerMenuToggleClick.bind( comp ) );

		// Submenu listeners.
		// Mainly applies to the anchors of submenus.
		this.$submenus.forEach( $submenu => {
			const $anchor = $submenu.previousElementSibling;

			if ( 'hover' === this.settings.action ) {
				$anchor.addEventListener( 'focus', this.listenerSubmenuAnchorFocus.bind( comp ) );
			}

			$anchor.addEventListener( 'click', this.listenerSubmenuAnchorClick.bind( comp ) );
		} );

		// Document specific listeners.
		// Mainly used to close any open menus.
		document.addEventListener( 'click', this.listenerDocumentClick.bind( comp ) );
		document.addEventListener( 'keyup', this.listenerDocumentKeyup.bind( comp ) );
	}

	/**
	 * Set
	 */

	/**
	 * Sets an media query related functions when the query boundry is reached.
	 *
	 * @returns {null}
	 */
	setMQ() {
		this.setMQMenuA11y();
		this.setMQSubbmenuA11y();
	}

	/**
	 * Sets any ARIA that changes as a result of the media query boundry being passed.
	 * Specifically for the toggle and main menu.
	 *
	 * @returns {null}
	 */
	setMQMenuA11y() {

		// Large
		if ( this.mq.matches ) {
			this.$menu.setAttribute( 'aria-hidden', false );
			this.$menuToggle.setAttribute( 'aria-expanded', true );
			this.$menuToggle.setAttribute( 'aria-hidden', true );
		// Small
		} else {
			this.$menu.setAttribute( 'aria-hidden', true );
			this.$menuToggle.setAttribute( 'aria-expanded', false );
			this.$menuToggle.setAttribute( 'aria-hidden', false );
		}

	}

	/**
	 * Sets an media query related functions when the query boundry is reached.
	 * Specifically for submenus.
	 *
	 * @returns {null}
	 */
	setMQSubbmenuA11y() {
		this.$submenus.forEach( $submenu => {
			$submenu.setAttribute( 'aria-hidden', true );
		} );
	}

	/**
	 * Opens the passed submenu.
	 *
	 * @param   {element} $submenu The submenu to open. Required.
	 * @returns {null}
	 */
	openSubmenu( $submenu ) {
		// Open the submenu by updating ARIA and class.
		$submenu.setAttribute( 'aria-hidden', false );

		/**
		 * Called when a submenu item is opened.
		 * @callback onSubmenuOpen - optional.
		 */
		if ( this.settings.onSubmenuOpen && 'function' === typeof this.settings.onSubmenuOpen ) {
			this.settings.onSubmenuOpen.call();
		}
	}

	/**
	 * Closes the passed submenu.
	 *
	 * @param   {element} $submenu The submenu to close. Required.
	 * @returns {null}
	 */
	closeSubmenu( $submenu ) {
		const $anchor = $submenu.previousElementSibling;
		const $childSubmenus = $submenu.querySelectorAll( 'li > .sub-menu[aria-hidden="false"]' );

		// Close the submenu by updating ARIA and class.
		$submenu.setAttribute( 'aria-hidden', true );

		if ( $childSubmenus ) {
			// Close any children as well.
			// Update their ARIA and class.
			this.closeSubmenus( $childSubmenus );
		}

		if ( ! this.mq.matches ) {
			$anchor.focus();
		}

		/**
		 * Called when a submenu item is closed.
		 * @callback onSubmenuClose - optional.
		 */
		if ( this.settings.onSubmenuClose && 'function' === typeof this.settings.onSubmenuClose ) {
			this.settings.onSubmenuClose.call();
		}
	}

	/**
	 * Closes all submenus in the node list.
	 *
	 * @param   {nodelist} $submenus The node list of submenus to close. Required.
	 * @returns {null}
	 */
	closeSubmenus( $submenus ) {
		$submenus.forEach( $submenu => {
			this.closeSubmenu( $submenu );
		} );
	}

	/**
	 * Listeners
	 */

	/**
	 * Menu toggle handler.
	 * Opens or closes the menu according to current state.
	 *
	 * @param {Object} event The event object.
	 * @returns {null}
	 */
	listenerMenuToggleClick( event ) {
		const isExpanded = ( 'true' === this.$menuToggle.getAttribute( 'aria-expanded' ) );

		// Don't act like a link.
		event.preventDefault();

		// Don't bubble.
		event.stopPropagation();

		// Is the menu currently open?
		if ( isExpanded ) {

			// Update ARIA
			this.$menu.setAttribute( 'aria-hidden', true );
			this.$menuToggle.setAttribute( 'aria-expanded', false );

			/**
			 * Called when a menu item is closed.
			 * @callback onClose - optional
			 */
			if ( this.settings.onClose && 'function' === typeof this.settings.onClose ) {
				this.settings.onClose.call();
			}
		} else {

			// Update ARIA
			this.$menu.setAttribute( 'aria-hidden', false );
			this.$menuToggle.setAttribute( 'aria-expanded', true );

			// Focus the first link in the menu
			this.$menu.querySelectorAll( 'a' )[0].focus();

			/**
			 * Called when a menu item is opened.
			 * @callback onOpen - optional
			 */
			if ( this.settings.onOpen && 'function' === typeof this.settings.onOpen ) {
				this.settings.onOpen.call();
			}
		}
	}

	/**
	 * Document click handler.
	 * Closes all open submenus on a click outside of the menu.
	 *
	 * @returns {null}
	 */
	listenerDocumentClick() {
		const $openSubmenus = this.$menu.querySelectorAll( '.sub-menu[aria-hidden="false"]' );

		// Bail if no submenus are found.
		if ( ! $openSubmenus ) {
			return;
		}

		// Close the submenus.
		this.closeSubmenus( $openSubmenus );
	}

	/**
	 * Document keyup handler.
	 * Closes all open menus on a escape key.
	 * Refocuses after closing submenus.
	 *
	 * @param   {Object} event The event object.
	 * @returns {null}
	 */
	listenerDocumentKeyup( event ) {
		const $openSubmenus = this.$menu.querySelectorAll( '.sub-menu[aria-hidden="false"]' );

		// Bail early if not using the escape key or if no submenus are found.
		if ( ! $openSubmenus || 27 !== event.keyCode ) {
			return;
		}

		// Close submenus
		this.closeSubmenus( $openSubmenus );

		// If we're set to click, set the focus back.
		if ( 'click' === this.settings.action ) {
			$openSubmenus[0].previousElementSibling.focus();
		}
	}

	/**
	 * Submenu anchor click handler.
	 * Opens or closes the submenu accordingly.
	 * Only fires based on settings and if the media query is appropriate.
	 *
	 * @param   {Object} event The event object. Required.
	 * @returns {null}
	 */
	listenerSubmenuAnchorClick( event ) {
		const $anchor = event.target;
		const $submenu = $anchor.nextElementSibling;
		const isHidden = ( 'true' === $submenu.getAttribute( 'aria-hidden' ) );

		let $openSubmenus = this.$menu.querySelectorAll( '.sub-menu[aria-hidden="false"]' );

		$openSubmenus = [...$openSubmenus].filter( menu => !menu.contains( $anchor ) );

		// Close the submenus.
		this.closeSubmenus( $openSubmenus );

		// Bail if set to hover and we're on a large screen.
		if ( 'hover' === this.settings.action && this.mq.matches ) {
			return;
		}

		// Don't let the link act like a link.
		event.preventDefault();

		// Don't bubble.
		event.stopPropagation();

		// Is the submenu hidden?
		if ( isHidden ) {
			// Yes, open it.
			this.openSubmenu( $submenu );
		} else {
			// No, close it.
			this.closeSubmenu( $submenu );
		}
	}

	/**
	 * Submenu anchor focus handler.
	 * Opens or closes the submenu accordingly.
	 * Only fires based on settings and if the media query is appropriate.
	 *
	 * @param   {Object} event The event object.
	 * @returns {null}
	 */
	listenerSubmenuAnchorFocus( event ) {
		const $anchor = event.target;
		const $menuItem = $anchor.parentNode;
		const $submenu = $anchor.nextElementSibling;
		const $childSubmenus = $menuItem.parentNode.querySelectorAll( '.sub-menu' );

		// Bail early if no submenu is found or if we're on a small screen.
		if ( ! $submenu || ! this.mq.matches ) {
			return;
		}

		// Close all sibling menus
		this.closeSubmenus( $childSubmenus );

		// Open this menu
		this.openSubmenu( $submenu );
	}
}
