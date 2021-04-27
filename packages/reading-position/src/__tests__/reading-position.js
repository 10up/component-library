import { axe } from 'jest-axe';
import { render, injectCSS } from 'test-utils/dom';
import { ReadingPosition } from '..';

let globalContainer;
let style;

beforeEach(() => {
	const lorem =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae ultrices odio, vitae pellentesque risus. Vivamus nulla urna, consequat nec congue ac, aliquam blandit quam. Praesent imperdiet, ipsum eget pharetra placerat, tortor nunc luctus diam, quis placerat leo sem et dui. Praesent nec magna et ligula elementum gravida ut vitae ligula. Duis vel diam lectus. Donec egestas tortor sem, eget euismod urna tincidunt id. Nam rhoncus consectetur vestibulum. Quisque non posuere felis. Donec vitae augue pretium, commodo erat eu, venenatis urna. Nam et nisi eleifend leo porttitor mollis sed ac libero. Vivamus tempus ac velit a suscipit.';
	const { container } = render(`
	<progress class="reading-position" value="0" max="100">
	${[1, 2, 3, 4, 5, 6, 7, 8, 10].map(() => lorem).join('<br />')}
	</progress>
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

test('destroy works', () => {
	const markup = globalContainer.innerHTML;

	const readingPosition = new ReadingPosition('.reading-position');

	readingPosition.destroy();
	expect(markup).toEqual(globalContainer.innerHTML);
});
