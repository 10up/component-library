import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Accordion from '../accordion';

beforeEach(() => {
	document.body.innerHTML = `
	<div class="accordion accordion--parent" role="region" aria-labelledby="header1">
			<button id="header1" class="accordion-header" type="button">Accordion Header 1</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 1st tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header 2</button>
			<div class="accordion-content">
				<h2 class="accordion-label">Parent Accordion Heading</h2>
				<p>here the content of 2nd tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header with Nested Accordion</button>
			<div class="accordion-content">
				<div class="accordion" role="region" aria-labelledby="header2">
					<button id="header2" class="accordion-header" type="button">Nested Accordion Header</button>
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

		<div class="accordion" role="region" aria-labelledby="header3">
			<button id="header3" class="accordion-header" type="button">Accordion Header</button>
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
});

test('accordion functions trigger', () => {
	const onCreate = jest.fn();
	const onOpen = jest.fn();
	const onClose = jest.fn();
	const onToggle = jest.fn();

	new Accordion('.accordion', {
		onCreate,
		onOpen,
		onToggle,
		onClose,
	});

	expect(onCreate).toHaveBeenCalledTimes(1);
	expect(onOpen).not.toHaveBeenCalled();
	expect(onToggle).not.toHaveBeenCalled();
	expect(onClose).not.toHaveBeenCalled();

	const header1 = screen.getByText('Accordion Header 1');
	const header2 = screen.getByText('Accordion Header 2');
	userEvent.click(header1);
	expect(onOpen).toHaveBeenCalledTimes(1);

	userEvent.click(header2);
	expect(onOpen).toHaveBeenCalledTimes(2);

	// close header 2
	userEvent.click(header2);
	expect(onClose).toHaveBeenCalledTimes(1);
	expect(onOpen).toHaveBeenCalledTimes(2);
	// open again
	userEvent.click(header2);
	expect(onOpen).toHaveBeenCalledTimes(3);

	expect(onToggle).toHaveBeenCalledTimes(4);
});

test('markup is accessible', async () => {
	expect(await axe(document.body.innerHTML)).toHaveNoViolations();
});
