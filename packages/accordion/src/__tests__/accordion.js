// import { screen } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
import Accordion from '../accordion';

test('it renders properly', () => {
	document.body.innerHTML = `
	<div class="accordion accordion--parent">
			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 1st tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Parent Accordion Heading</h2>
				<p>here the content of 2nd tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header with Nested Accordion</button>
			<div class="accordion-content">
				<div class="accordion">

					<button class="accordion-header" type="button">Nested Accordion Header</button>
					<div class="accordion-content">
						<h2 class="accordion-label">Nested Accordion Heading</h2>
						<p>here the content of 1st tab <a href="#">link</a></p>
					</div> <!-- //.accordion-content -->

					<button class="accordion-header" type="button">Nested Accordion Header</button>
					<div class="accordion-content">
						<h2 class="accordion-label">Nested Accordion Heading</h2>
						<p>here the content of 2nd tab <a href="#">link</a></p>
					</div> <!-- //.accordion-content -->

				</div> <!-- //.accordion -->
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 4th tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

		</div> <!-- //.accordion -->

		<div class="accordion">

			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 1st tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 2nd tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 3rd tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 4th tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

		</div> <!-- //.accordion -->
	`;

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
});
