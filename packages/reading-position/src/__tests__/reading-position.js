import { axe } from 'jest-axe';
import { render, injectCSS } from 'test-utils/dom';

import { ReadingPosition } from '..';

let globalContainer;
let style;

beforeEach(() => {
	const { container } = render(`
	<progress class="reading-position" value="0" max="100"></progress>
	`);

	globalContainer = container;
	style = injectCSS(`${__dirname}/../../dist/index.css`);
});

afterEach(() => {
	document.body.removeChild(globalContainer);
	document.body.removeChild(style);
});

test('markup is accessible', async () => {
	new ReadingPosition('.reading-position');

	expect(await axe(globalContainer)).toHaveNoViolations();
});
