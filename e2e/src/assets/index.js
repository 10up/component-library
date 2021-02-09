import './style.css';

import { Accordion } from '@10up/component-accordion';

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
