'use strict';

export default class Accordion {

	constructor( element, options = {} ) {

		// Defaults
		const defaults = {

			// Event callbacks
			onCreate: null,
			onOpen: null,
			onClose: null,
			onToggle: null,
		};

		if ( ! element || 'string' !== typeof element ) {
			console.error( '10up Accordion: No target supplied. A valid target (accordion area) must be used.' ); // eslint-disable-line
			return;
		}

		// Accordion Containers
		this.$accordions = document.querySelectorAll( element );

		// Bail out if there's no accordion.
		if ( ! this.$accordions  ) {
			console.error( '10up Accordion: Target not found. A valid target (accordion area) must be used.'  ); // eslint-disable-line
			return;
		}

		document.documentElement.classList.add( 'js' );

		// Settings
		this.settings = Object.assign( {}, defaults, options );

		this.$accordions.forEach( ( accordionArea, index ) => {
			this.setupAccordion( accordionArea, index );
		} );

		// Do any callbacks, if assigned.
		if ( this.settings.onCreate && 'function' === typeof this.settings.onCreate ) {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Initialize a given accordion area
	 * Configure accordion properties and set AIRA attributes.
	 *
	 * @param   {element} $accordionArea      The accordionArea to scope changes
	 * @param   {number}  $accordionAreaIndex The index of the accordionArea
	 * @returns {void}
	 */
	setupAccordion( accordionArea, accordionAreaIndex ) {

		let accordionLinks = accordionArea.querySelectorAll( '.accordion-header' );
		let accordionContent = accordionArea.querySelectorAll( '.accordion-content' );

		// Set ARIA attributes for accordion links
		accordionLinks.forEach( ( accordionLink, index ) => {
			accordionLink.setAttribute( 'id', `tab${accordionAreaIndex}-${index}` );
			accordionLink.setAttribute( 'aria-selected', 'false' );
			accordionLink.setAttribute( 'aria-expanded', 'false' );
			accordionLink.setAttribute( 'aria-controls', `panel${accordionAreaIndex}-${index}` );
			accordionLink.setAttribute( 'role', 'tab' );

			// Handle click event to toggle accordion items
			accordionLink.addEventListener( 'click', () => {
				event.preventDefault();
				this.toggleAccordionItem( event );
			} );
		} );

		// Set ARIA attributes for accordion content areas
		accordionContent.forEach( ( accordionContent, index ) => {
			accordionContent.setAttribute( 'id', `panel${accordionAreaIndex}-${index}` );
			accordionContent.setAttribute( 'aria-hidden', 'true' );
			accordionContent.setAttribute( 'aria-labelledby', `tab${accordionAreaIndex}-${index}` );
			accordionContent.setAttribute( 'role', 'tabpanel' );
		} );
	}

	/**
	 * Toggles a given accordion item
	 * Add or remove necessary CSS classes and toggle AIRA attributes.

	 * @param   {object} $event The accordion click event
	 * @returns {void}
	 */
	toggleAccordionItem( event ) {

		let accordionLink = event.target;
		let accordionContent = accordionLink.nextElementSibling;
		let accordionHeading = accordionContent.querySelector( '.accordion-label' );

		// Toggle active class on accordion link and content
		accordionLink.classList.toggle( 'is-active' );
		accordionContent.classList.toggle( 'is-active' );

		// Set focus on the accordion heading
		accordionHeading.setAttribute( 'tabindex', -1 );
		accordionHeading.focus();

		if ( accordionContent.classList.contains( 'is-active' ) ) {
			// Show accordion item
			accordionLink.setAttribute( 'aria-selected', 'true' );
			accordionLink.setAttribute( 'aria-expanded', 'true' );
			accordionContent.setAttribute( 'aria-hidden', 'false' );

			// Custom accordion open callback
			if ( this.settings.onOpen && 'function' === typeof this.settings.onOpen ) {
				this.settings.onOpen.call();
			}
		} else {
			// Hide accordion item
			accordionLink.setAttribute( 'aria-selected', 'false' );
			accordionLink.setAttribute( 'aria-expanded', 'false' );
			accordionContent.setAttribute( 'aria-hidden', 'true' );

			// Custom accordion close callback
			if ( this.settings.onClose && 'function' === typeof this.settings.onClose ) {
				this.settings.onClose.call();
			}
		}

		// Custom accordion toggle callback
		if ( this.settings.onToggle && 'function' === typeof this.settings.onToggle ) {
			this.settings.onToggle.call();
		}
	}
}

