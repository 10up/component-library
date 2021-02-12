import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { render, injectCSS } from 'test-utils/dom';

import { Navigation } from '..';

beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(), // Deprecated
			removeListener: jest.fn(), // Deprecated
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		})),
	});
});

let globalContainer;
let style;

beforeEach(() => {
	const { container } = render(`
	<nav class="site-navigation" role="navigation" itemscope="itemscope" itemtype="http://schema.org/SiteNavigationElement">

	<a href="#primary-nav" aria-controls="primary-nav" class="site-menu-toggle">
		<span class="screen-reader-text">Primary Menu</span>
		<span aria-hidden="true">☰</span>
	</a>

	<ul id="primary-nav" class="primary-menu">
		<li id="menu-item-1912" class="menu-item">
			<a href="#!aboutus">About Us</a>
		</li>
		<li id="menu-item-1913" class="menu-item menu-item-has-children">
			<a href="#!ourwork">Our Work</a>
			<ul class="sub-menu">
				<li id="menu-item-1914" class="menu-item">
					<a href="#!js">JavaScript</a>
				</li>
				<li id="menu-item-4494" class="menu-item menu-item-has-children">
					<a href="#!wp">WordPress</a>
					<ul class="sub-menu">
						<li id="menu-item-4495" class="menu-item">
							<a href="#!plugins">Plugins</a>
						</li>
						<li id="menu-item-4496" class="menu-item">
							<a href="#!themes">Themes</a>
						</li>
						<li id="menu-item-4496" class="menu-item">
							<a href="#!last">Last WP Item</a>
						</li>
					</ul>
				</li>
			</ul>
		</li>
		<li id="menu-item-1915" class="menu-item">
			<a href="#!giving">Giving Back</a>
		</li>
		<li id="menu-item-1916" class="menu-item menu-item-has-children">
			<a href="#!blog">Blog</a>
			<ul class="sub-menu">
				<li class="menu-item"><a href="#!post">Blog Post 1</a></li>
				<li class="menu-item"><a href="#!post">Blog Post 2</a></li>
				<li class="menu-item"><a href="#!post">Blog Post 3</a></li>
			</ul>
		</li>
		<li id="menu-item-1916" class="menu-item">
			<a href="#!contact">Contact</a>
		</li>
	</ul>

</nav>
	`);

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
	const onSubmenuOpen = jest.fn();
	const onSubmenuClose = jest.fn();

	new Navigation('#primary-nav', {
		onCreate,
		onOpen,
		onClose,
		onSubmenuOpen,
		onSubmenuClose,
	});

	expect(onCreate).toHaveBeenCalled();
	expect(onOpen).not.toHaveBeenCalled();
	expect(onClose).not.toHaveBeenCalled();
	expect(onSubmenuOpen).not.toHaveBeenCalled();
	expect(onSubmenuClose).not.toHaveBeenCalled();

	// open a submenu
	const submenu1 = document.querySelector('#menu-item-1913 > a');
	userEvent.click(submenu1);
	expect(onSubmenuOpen).toHaveBeenCalledTimes(1);
	// close a submenu
	userEvent.click(submenu1);
	expect(onSubmenuClose).toHaveBeenCalled();
});

test('submenus expand appropriately', () => {
	new Navigation('#primary-nav');

	const submenu1 = screen.getByText('Our Work');
	// open
	userEvent.click(submenu1);
	expect(submenu1.parentElement.querySelector('ul.sub-menu')).toHaveAttribute(
		'aria-hidden',
		'false',
	);

	// oepn sub sub menu
	const subsubmenu1 = screen.getByText('WordPress');
	userEvent.click(subsubmenu1);
	expect(subsubmenu1.parentElement.querySelector('ul.sub-menu')).toHaveAttribute(
		'aria-hidden',
		'false',
	);
	// close sub sub menu
	userEvent.click(subsubmenu1);

	// close sub menu
	userEvent.click(submenu1);
	expect(submenu1.parentElement.querySelector('ul.sub-menu')).toHaveAttribute(
		'aria-hidden',
		'true',
	);
});

test.skip('markup is accessible', async () => {
	new Navigation('#primary-nav');

	expect(await axe(document.querySelector('#primary-nav'))).toHaveNoViolations();
});
