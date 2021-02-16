import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { render, injectCSS } from 'test-utils/dom';
import { Tooltip } from '..';

let globalContainer;
let style;

beforeEach(() => {
	const { container } = render(`
			<span class="a11y-tip a11y-tip--toggle">
			<span class="a11y-tip__trigger">
				Tooltip Toggle Trigger
			</span>

			<span class="a11y-tip__help">
				Tooltip content goes here
			</span>
		</span><!--/.a11y-tip-->`);

	globalContainer = container;
	style = injectCSS(`${__dirname}/../../dist/index.css`);
});

afterEach(() => {
	document.body.removeChild(globalContainer);
	document.body.removeChild(style);
});

test('callbacks are triggered properly', () => {
	const onCreate = jest.fn();
	const onOpen = jest.fn();
	const onClose = jest.fn();

	new Tooltip('.a11y-tip', {
		onCreate,
		onOpen,
		onClose,
	});

	expect(onCreate).toHaveBeenCalled();
	expect(onOpen).not.toHaveBeenCalled();
	expect(onClose).not.toHaveBeenCalled();

	const spanTooltip = screen.getByText('Tooltip Toggle Trigger');
	userEvent.click(spanTooltip);
	expect(onOpen).toHaveBeenCalled();
	userEvent.click(spanTooltip);

	expect(onClose).toHaveBeenCalled();
});

test('markup is accessible', async () => {
	new Tooltip('.a11y-tip');

	expect(await axe(document.querySelector('.a11y-tip'))).toHaveNoViolations();
});
