import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render, injectCSS } from 'test-utils/dom';
import { axe } from 'jest-axe';
import { Accordion } from '..';

let globalContainer;
let style;

beforeEach(() => {
	const { container } = render(`
	<div class="accordion accordion--parent">
			<button class="accordion-header" type="button">Accordion Header 1</button>
			<div class="accordion-content" data-testid="accordion-content-1">
				<h2 class="accordion-label">Accordion Heading</h2>
				<p>here the content of 1st tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header 2</button>
			<div class="accordion-content" data-testid="accordion-content-2">
				<h2 class="accordion-label">Parent Accordion Heading</h2>
				<p>here the content of 2nd tab <a href="#">link</a></p>
			</div> <!-- //.accordion-content -->

			<button class="accordion-header" type="button">Accordion Header with Nested Accordion</button>
			<div class="accordion-content" data-testid="accordion-content-nested">
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
			<buttonclass="accordion-header" type="button">Accordion Header</button>
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
	`);

	globalContainer = container;
	style = injectCSS(`${__dirname}/../../dist/index.css`);
});

afterEach(() => {
	document.body.removeChild(globalContainer);
	document.body.removeChild(style);
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

test('accordion works as expected', async () => {
	new Accordion('.accordion');

	const header1 = screen.getByText('Accordion Header 1');

	const header2 = screen.getByText('Accordion Header 2');
	const content1 = screen.getByTestId('accordion-content-1');
	const content2 = screen.getByTestId('accordion-content-2');

	userEvent.click(header1);
	expect(content1).toBeVisible();
	userEvent.click(header1);
	expect(content2).not.toBeVisible();

	userEvent.click(header1);
	userEvent.click(header2);
	expect(content1).toBeVisible();
	expect(content2).toBeVisible();

	// ensure markup is accessible after interacting with the accordion
	expect(await axe(document.querySelector('.accordion'))).toHaveNoViolations();

	userEvent.click(header1);
	expect(content1).not.toBeVisible();
	expect(content2).toBeVisible();
	userEvent.click(header2);
	expect(content2).not.toBeVisible();
});

test('nested accordion works', async () => {
	new Accordion('.accordion');

	const nestedAccordionHeader = screen.getByText('Accordion Header with Nested Accordion');
	const nestedAccordionContent = screen.getByTestId('accordion-content-nested');
	userEvent.click(nestedAccordionHeader);

	expect(nestedAccordionContent).toBeVisible();

	expect(await axe(document.querySelector('.accordion'))).toHaveNoViolations();

	// expand nested accordions
	const subAccordionHeader = screen.getAllByText('Nested Accordion Header');

	subAccordionHeader.forEach((h) => {
		userEvent.click(h);

		const subAccordionContent = h.parentElement.querySelector('.accordion-content');
		expect(subAccordionContent).toBeVisible();
	});

	userEvent.click(nestedAccordionHeader);
	expect(nestedAccordionContent).not.toBeVisible();
});

test('destroying accordion works', async () => {
	const originalMarkup = document.querySelector('.accordion').innerHTML;
	const accordion = new Accordion('.accordion');

	accordion.destroy();

	expect(originalMarkup).toEqual(document.querySelector('.accordion').innerHTML);
});

test('markup is accessible', async () => {
	new Accordion('.accordion');
	expect(await axe(document.querySelector('.accordion'))).toHaveNoViolations();
});
