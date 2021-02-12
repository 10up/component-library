import './style.css';

// eslint-disable-next-line
import { Accordion } from '@10up/component-accordion';
// eslint-disable-next-line
import { CountdownTimer } from '@10up/countdown-timer';

document.addEventListener('DOMContentLoaded', () => {
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

	const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

	const timer = document.querySelector('.countdown-timer');

	if (timer) {
		timer.setAttribute('datetime', oneYearFromNow.toISOString());
	}

	new CountdownTimer('.countdown-timer');
});
