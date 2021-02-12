import './style.css';

// eslint-disable-next-line
import { Accordion } from '@10up/component-accordion';
// eslint-disable-next-line
import { CountdownTimer } from '@10up/countdown-timer';

// eslint-disable-next-line
import { Tabs } from '@10up/component-tabs';

// eslint-disable-next-line
import { Navigation } from '@10up/component-navigation';

// eslint-disable-next-line
import { Tooltip } from '@10up/component-tooltip';

document.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('#primary-nav')) {
		new Navigation('#primary-nav', {
			action: 'click',
		});
	}

	if (document.querySelector('.accordion')) {
		new Accordion('.accordion', {
			onCreate() {
				console.log('onCreated 3');
			},
			onOpen() {
				console.log('onOpen');
			},
			onClose() {
				console.log('onClose');
			},
			onToggle() {
				console.log('onToggle');
			},
		});
	}

	if (document.querySelectorAll('.tabs')) {
		new Tabs('.tabs');

		new Tabs('.tabs-vertical', {
			orientation: 'vertical',
		});
	}

	if (document.querySelectorAll('.a11y-tip')) {
		new Tooltip('.a11y-tip');
	}

	const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

	const timer = document.querySelector('.countdown-timer');
	if (timer) {
		timer.setAttribute('datetime', oneYearFromNow.toISOString());
		new CountdownTimer('.countdown-timer');
	}
});
