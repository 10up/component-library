import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tooltip } from '..';

beforeEach(() => {
	document.body.innerHTML = `
	<div>
		<span class="a11y-tip">
			<span class="a11y-tip__trigger">
				Tooltip Trigger span
			</span>

			<span class="a11y-tip__help">
				Tooltip content goes here
			</span>
		</span><!--/.a11y-tip-->
	</div>

	<div>
		<span class="a11y-tip a11y-tip--no-delay">
			<a href="#tt_id" class="a11y-tip__trigger">
				Link w/top tooltip
			</a>

			<span id="tt_id" class="a11y-tip__help a11y-tip__help--top">
				Activate this link to go somewhere!
			</span>
		</span><!--/.a11y-tip-->
	</div>

	<div>
		<span class="a11y-tip">
			<button type="button" class="a11y-tip__trigger" aria-describedby="tt_id" aria-controls="tt_id">
				Button w/bottom tooltip
			</button>

			<span id="tt_id" role="tooltip" class="a11y-tip__help a11y-tip__help--bottom">
				Buttons do things on the page. Activate it to perform an action.
			</span>
		</span><!--/.a11y-tip-->
	</div>

	<div>
		<label for="test">
			Input with right tooltip
		</label>
		<span class="a11y-tip">
			<input id="test" placeholder="enter text" class="a11y-tip__trigger" aria-describedby="test_desc" type="text">

			<span id="test_desc" role="tooltip" class="a11y-tip__help a11y-tip__help--right">
				Enter something here. Text would be fine.
			</span>
		</span><!--/.a11y-tip-->
	</div>
	`;
});

test.skip('callbacks are triggered properly', () => {
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

	const spanTooltip = screen.getByText('Tooltip Trigger span');
	userEvent.hover(spanTooltip);
	expect(onOpen).toHaveBeenCalled();
});

test('tooltips with a link', () => {});

test.skip('markup is accessible', async () => {
	new Tooltip('.tabs');

	expect(await axe(document.body.innerHTML)).toHaveNoViolations();
});
