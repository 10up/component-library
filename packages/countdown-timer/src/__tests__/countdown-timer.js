import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { render } from 'test-utils/dom';
import { CountdownTimer } from '..';

let globalContainer;

beforeEach(() => {
	const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

	const { container } = render(`
	<time class="countdown-timer" datetime="${oneYearFromNow.toISOString()}">
		${oneYearFromNow.toISOString()}
	</time>
	`);

	globalContainer = container;
});

afterEach(() => {
	document.body.removeChild(globalContainer);
});

test('markup is accessible', async () => {
	new CountdownTimer('.countdown-timer');

	expect(await axe(document.querySelector('.countdown-timer'))).toHaveNoViolations();
});

test('countdown timer starts a timer', () => {
	const onCreate = jest.fn();
	const onTick = jest.fn();
	const onEnd = jest.fn();

	new CountdownTimer('.countdown-timer', {
		onCreate,
		onEnd,
		onTick,
	});

	const timer = screen.getByRole('timer');

	expect(timer).toHaveTextContent('1 year, 0 weeks, 0 days, 23 hours, 59 minutes');
	expect(onCreate).toHaveBeenCalledTimes(1);
	expect(onTick).toHaveBeenCalledTimes(1);
	expect(onEnd).not.toHaveBeenCalled();
});

test('destroy works', () => {
	jest.useFakeTimers();
	const timerHTML = globalContainer.innerHTML;
	const countdownTimer = new CountdownTimer('.countdown-timer');
	const timer = screen.getByRole('timer');

	expect(timer).toHaveTextContent('1 year, 0 weeks, 0 days, 23 hours, 59 minutes');
	// destroy and leave attributes and text content
	countdownTimer.destroy({ removeAttributes: false, restoreTextContent: false });
	const frozenTimer = timer.textContent;
	jest.runAllTimers();
	expect(timer).toHaveTextContent(frozenTimer);

	// restore text content
	countdownTimer.destroy({ removeAttributes: false, restoreTextContent: true });
	expect(timer).not.toHaveTextContent('1 year, 0 weeks, 0 days, 23 hours');
	expect(timerHTML).not.toEqual(document.body.innerHTML);

	// destory and restore everything
	countdownTimer.destroy();
	expect(timerHTML).toEqual(globalContainer.innerHTML);
});
