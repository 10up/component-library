export default class Accordion {
	/**
	 * constructor function
	 *
	 * @param element The accordion target elemnet.
	 * @param options The acccordion options.
	 */
	constructor(element, options = {}) {
		// Defaults
		const defaults = {
			// Event callbacks
			onCreate: null,
			onOpen: null,
			onClose: null,
			onToggle: null,
		};

		// forEach Polyfill
		if (window.NodeList && !NodeList.prototype.forEach) {
			NodeList.prototype.forEach = function (callback, thisArg) {
				// eslint-disable-next-line
				thisArg = thisArg || window;
				for (let i = 0; i < this.length; i++) {
					callback.call(thisArg, this[i], i, this);
				}
			};
		}

		if (!element || typeof element !== 'string') {
			console.error( '10up Accordion: No target supplied. A valid target (accordion area) must be used.' ); // eslint-disable-line
			return;
		}

		// Accordion containers
		this.$accordions = document.querySelectorAll(element);

		// Bail out if there's no accordion.
		if (!this.$accordions) {
			console.error( '10up Accordion: Target not found. A valid target (accordion area) must be used.'  ); // eslint-disable-line
			return;
		}

		document.documentElement.classList.add('js');

		// Settings
		this.settings = { ...defaults, ...options };
		this.$accordions.forEach((accordionArea, index) => {
			this.setupAccordion(accordionArea, index);
		});

		/**
		 * Called after the accordion is initialized on page load.
		 *
		 * @callback onCreate
		 */
		if (this.settings.onCreate && typeof this.settings.onCreate === 'function') {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Initialize a given accordion area.
	 * Configure accordion properties and set ARIA attributes.
	 *
	 * @param   {element} accordionArea      The accordionArea to scope changes.
	 * @param   {number}  accordionAreaIndex The index of the accordionArea.
	 */
	setupAccordion(accordionArea, accordionAreaIndex) {
		const allAccordionLinks = accordionArea.querySelectorAll('.accordion-header');
		const allAccordionContent = accordionArea.querySelectorAll('.accordion-content');

		// Make sure accordionLinks and accordionContent are direct descendants of accordionArea
		const accordionLinks = Array.prototype.slice
			.call(allAccordionLinks)
			.filter((link) => link.parentNode === accordionArea);
		const accordionContent = Array.prototype.slice
			.call(allAccordionContent)
			.filter((content) => content.parentNode === accordionArea);

		// Handle keydown event to move between accordion items
		accordionArea.addEventListener('keydown', (event) => {
			const selectedElement = event.target;
			const key = event.which;

			// Make sure the selected element is a header and a direct descendant of the current accordionArea
			if (
				selectedElement.classList.contains('accordion-header') &&
				selectedElement.parentNode === accordionArea
			) {
				this.accessKeyBindings(accordionLinks, selectedElement, key, event);
			}
		});

		// Set ARIA attributes for accordion links
		accordionLinks.forEach((accordionLink, index) => {
			accordionLink.setAttribute('id', `tab${accordionAreaIndex}-${index}`);
			accordionLink.setAttribute('aria-expanded', 'false');
			accordionLink.setAttribute('aria-controls', `panel${accordionAreaIndex}-${index}`);

			// Handle click event to toggle accordion items
			accordionLink.addEventListener('click', (event) => {
				event.preventDefault();
				this.toggleAccordionItem(event);
			});
		});

		// Set ARIA attributes for accordion content areas
		accordionContent.forEach((accordionContent, index) => {
			accordionContent.setAttribute('id', `panel${accordionAreaIndex}-${index}`);
			accordionContent.setAttribute('aria-hidden', 'true');
			accordionContent.setAttribute('aria-labelledby', `tab${accordionAreaIndex}-${index}`);
		});
	}

	/**
	 * Open a given accordion item
	 * Add or remove necessary CSS classes and toggle ARIA attributes.
	 *
	 * @param {element} accordionLink The accordion heading link
	 * @param {element} accordionContent The accordion content to open
	 */
	openAccordionItem(accordionLink, accordionContent) {
		accordionLink.setAttribute('aria-expanded', 'true');
		accordionContent.setAttribute('aria-hidden', 'false');

		/**
		 * Called when an accordion item is opened.
		 *
		 * @callback onOpen
		 */
		if (this.settings.onOpen && typeof this.settings.onOpen === 'function') {
			this.settings.onOpen.call();
		}
	}

	/**
	 * Close a given accordion item
	 * Add or remove necessary CSS classes and toggle ARIA attributes.
	 *
	 * @param {element} accordionLink The accordion heading link
	 * @param {element} accordionContent The accordion content to open
	 */
	closeAccordionItem(accordionLink, accordionContent) {
		accordionLink.setAttribute('aria-expanded', 'false');
		accordionContent.setAttribute('aria-hidden', 'true');

		/**
		 * Called when an accordion item is closed.
		 *
		 * @callback onClose
		 */
		if (this.settings.onClose && typeof this.settings.onClose === 'function') {
			this.settings.onClose.call();
		}
	}

	/**
	 * Toggles a given accordion item.
	 * Add or remove necessary CSS classes and toggle ARIA attributes.
	 *
	 * @param   {object} event The accordion click event
	 */
	toggleAccordionItem(event) {
		const accordionLink = event.target;
		const accordionContent = accordionLink.nextElementSibling;
		const accordionHeading = accordionContent.querySelector('.accordion-label');

		// Toggle active class on accordion link and content.
		accordionLink.classList.toggle('is-active');
		accordionContent.classList.toggle('is-active');

		// Set focus on the accordion heading.
		if (accordionHeading) {
			accordionHeading.setAttribute('tabindex', -1);
			accordionHeading.focus();
		}

		if (accordionContent.classList.contains('is-active')) {
			this.openAccordionItem(accordionLink, accordionContent);
		} else {
			this.closeAccordionItem(accordionLink, accordionContent);
		}

		/**
		 * Called when an accordion item is toggled.
		 *
		 * @callback onToggle
		 */
		if (this.settings.onToggle && typeof this.settings.onToggle === 'function') {
			this.settings.onToggle.call();
		}
	}

	/**
	 * Moves and focus between items based on the selected item and the key pressed.
	 *
	 * @param   {element[]} accordionLinks The array of accordion links.
	 * @param	{element} selectedElement The accordion link where the key action triggers.
	 * @param	{number} key The key code of the key pressed.
	 * @param	{object} event The accordion keydown event.
	 */
	accessKeyBindings(accordionLinks, selectedElement, key, event) {
		let linkIndex;

		accordionLinks.forEach((accordionLink, index) => {
			if (selectedElement === accordionLink) {
				linkIndex = index;
			}
		});

		switch (key) {
			// End key
			case 35:
				linkIndex = accordionLinks.length - 1;
				event.preventDefault();
				break;
			// Home key
			case 36:
				linkIndex = 0;
				event.preventDefault();
				break;
			// Up arrow
			case 38:
				linkIndex--;
				if (linkIndex < 0) {
					linkIndex = accordionLinks.length - 1;
				}
				event.preventDefault();
				break;
			// Down arrow
			case 40:
				linkIndex++;
				if (linkIndex > accordionLinks.length - 1) {
					linkIndex = 0;
				}
				event.preventDefault();
				break;
			default:
				break;
		}

		const newLinkIndex = linkIndex;
		accordionLinks[newLinkIndex].focus();
	}
}
