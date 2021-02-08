import { Accordion } from '@10up/component-accordion';

new Accordion('.accordion', {
	onCreate() {
		console.log('onCreated');
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
