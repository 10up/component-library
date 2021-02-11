import 'core-js/es/object/assign';
import 'core-js/web/dom-collections';
import 'core-js/es/array/includes';

/**
 * @module @10up/Tooltip
 *
 * @description
 *
 * An accessible tooltip component.
 *
 * @param {string} element Element selector for the tooltip container.
 * @param {object} options Object of optional callbacks.
 */
export default class Tooltip {
	/**
	 * Initialize tooltips
	 *
	 * @param {string} element Element selector for the tooltip container.
	 * @param {object} options Object of optional callbacks.
	 */
	constructor(element, options = {}) {
		const defaults = {
			onCreate: null,
			onOpen: null,
			onClose: null,
		};

		// Tooltip Containers
		this.$tooltips = document.querySelectorAll(element);

		if (!element && this.$tooltips.length === 0) {
			console.error( '10up Tooltip: Target not found. A valid target (tooltip container) must be used.'  ); // eslint-disable-line
			return;
		}

		document.documentElement.classList.add('js');

		// Settings
		this.settings = { ...defaults, ...options };

		// Bind internal methods
		this.manageBoundTrigger = (evt) => this.manageTrigger(evt);
		this.boundManageTT = (evt) => this.manageTT(evt);
		this.boundManageEsc = (evt) => this.manageEsc(evt);

		this.$tooltips.forEach((ttContainer) => {
			this.setupTooltip(ttContainer);
		});

		this.settings = { ...defaults, ...options };

		/**
		 * Called after the tooltip is initialized on page load.
		 *
		 * @callback onCreate
		 */
		if (this.settings.onCreate && typeof this.settings.onCreate === 'function') {
			this.settings.onCreate.call();
		}
	}

	/**
	 * Initialize a given tooltip area.
	 *
	 * @param   {element} $ttContainer The tooltip containing element.
	 * @param ttContainer
	 * @returns {void}
	 */
	setupTooltip(ttContainer) {
		const ttToggleClass = 'a11y-tip--toggle';
		const ttTriggerClass = 'a11y-tip__trigger';
		const ttTriggerToggleClass = 'a11y-tip__trigger--toggle';
		const ttTrigger = `.${ttTriggerClass}`;
		const ttTheTip = '.a11y-tip__help';
		let newButton;
		let originalTrigger;
		let getTipId;
		const focusableElements = ['a', 'button', 'input', 'textarea', 'select'];

		// This will be needed for any components that don't have an ID set
		const count = 1;
		const self = ttContainer;
		const trigger = self.querySelector(ttTrigger);
		const tip = self.querySelector(ttTheTip);

		// If a trigger is not an inherently focusable element, it'll need a
		// tabindex. But if it can be inherently focused, then don't set a tabindex.
		if (!focusableElements.includes(trigger.nodeName.toLowerCase())) {
			trigger.setAttribute('tabindex', '0');
		}

		// If a tip doesn't have an ID, then we need to generate one.
		if (!tip.getAttribute('id')) {
			tip.setAttribute('id', `tool_tip_${count}`);
		}

		// If a trigger doesn't have an aria-described by, then we need
		// to point it to the tip's ID.
		if (!trigger.getAttribute('aria-describedby')) {
			trigger.setAttribute('aria-describedby', tip.getAttribute('id'));
		}

		// If the element after a tooltip trigger does not have
		// the role of tooltip set, then set it.
		if (!tip.getAttribute('role')) {
			tip.setAttribute('role', 'tooltip');
		}

		// If a tip container has ttToggleClass,
		// we need to make sure the trigger is a button.
		if (self.classList.contains(ttToggleClass)) {
			originalTrigger = self.querySelector(ttTrigger).innerHTML;
			originalTrigger = originalTrigger.replace(/^\s+|\s+$/g, '');
			getTipId = self.querySelector(ttTheTip).getAttribute('id');
			newButton = document.createElement('button');

			newButton.setAttribute('type', 'button');
			newButton.classList.add(ttTriggerClass);
			newButton.classList.add(ttTriggerToggleClass);
			newButton.setAttribute('aria-describedby', getTipId);
			newButton.setAttribute('aria-expanded', 'false');
			newButton.textContent = originalTrigger;

			self.removeChild(self.querySelector(ttTrigger));
			self.insertBefore(newButton, self.firstChild);

			// Set event listener for trigger click
			newButton.addEventListener('click', this.manageBoundTrigger);
		} // if self contains the toggleClass

		if (self.classList.contains(ttToggleClass) === false) {
			// Set Listeners for callbacks to fire
			tip.addEventListener('transitionend', this.boundManageTT);
		}

		// Hide the tooltip on ESC because we have empathy and sometimes
		// you just don't want a tool tip all up in your face, right?
		// if a keyboard user doesn't want/need the tooltip anymore
		// allow them to hide it by pressing the ESC key.
		// once they move focus away from the element that had the
		// the tooltip, remove the hide-tip class so that the
		// tip can be accessed again on re-focus.
		trigger.addEventListener('keyup', this.boundManageEsc);
	}

	/**
	 * Listens for `transitionend`.
	 *
	 * @listens transitionend
	 * @param   {object} e - The transitionend event object.
	 */
	manageTT(e) {
		const { target } = e;

		if (!e.pseudoElement) {
			if (target.classList.contains('a11y-tip--hide')) {
				target.classList.remove('a11y-tip--hide');
			}

			if (window.getComputedStyle(e.target).opacity === '0') {
				/**
				 * Called when a tooltip is closed.
				 *
				 * @callback onClose
				 */
				if (this.settings.onClose && typeof this.settings.onClose === 'function') {
					this.settings.onClose.call();
				}
			} else if (this.settings.onOpen && typeof this.settings.onOpen === 'function') {
				/**
				 * Called when a tooltip is opened.
				 *
				 * @callback onOpen
				 */

				this.settings.onOpen.call();
			}
		}
	}

	/**
	 * Allows user to 'esc' out of a tooltip with keyup.
	 *
	 * @listens keyup
	 * @param   {object} e The keyup event object.
	 */
	manageEsc(e) {
		const { target } = e;

		if (e.keyCode === 27) {
			e.preventDefault();
			target.classList.add('a11y-tip--hide');

			/**
			 * Called when a tooltip is closed.
			 *
			 * @callback onClose
			 */
			if (this.settings.onClose && typeof this.settings.onClose === 'function') {
				this.settings.onClose.call();
			}
		}
	}

	/**
	 * Modifies ARIA based on click event.
	 *
	 * @listens click
	 * @param  {object} e The click event object.
	 */
	manageTrigger(e) {
		const triggerEl = e.target;

		if (triggerEl.getAttribute('aria-expanded') === 'true') {
			triggerEl.setAttribute('aria-expanded', 'false');

			/**
			 * Called when a tooltip is closed.
			 *
			 * @callback onClose
			 */
			if (this.settings.onClose && typeof this.settings.onClose === 'function') {
				this.settings.onClose.call();
			}
		} else if (triggerEl.getAttribute('aria-expanded') === 'false') {
			triggerEl.setAttribute('aria-expanded', 'true');

			/**
			 * Called when a tooltip is opened.
			 *
			 * @callback onOpen
			 */
			if (this.settings.onOpen && typeof this.settings.onOpen === 'function') {
				this.settings.onOpen.call();
			}
		}
	}
}
