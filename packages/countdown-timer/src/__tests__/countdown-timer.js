import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';
import { CountdownTimer } from '..';

beforeEach(() => {
	const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

	document.body.innerHTML = `
	<time class="countdown-timer" datetime="${oneYearFromNow.toISOString()}">
		${oneYearFromNow.toISOString()}
	</time>
	`;
});

test.skip('markup is accessible', async () => {
	new CountdownTimer('.countdown-timer');

	expect(await axe(document.body.innerHTML)).toHaveNoViolations();
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
