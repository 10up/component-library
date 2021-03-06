import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { render, injectCSS } from 'test-utils/dom';
import { axe } from 'jest-axe';
import { Tabs } from '..';

let style;
let globalContainer;

beforeEach(() => {
	const { container } = render(`
		<div class="tabs">
		<div class="tab-control">
			<ul class="tab-list" role="tablist">
				<li class="tab-item"><a href="#js-tab1" role="tab" aria-controls="js-tab1">View Tab 1</a></li>
				<li class="tab-item"><a href="#js-tab2" role="tab" aria-controls="js-tab2">View Tab 2</a></li>
				<li class="tab-item"><a href="#js-tab3" role="tab" aria-controls="js-tab3">View Tab 3</a></li>
				<li class="tab-item"><a href="#js-tab4" role="tab" aria-controls="js-tab4">View Tab 4</a></li>
				<li class="tab-item"><a href="#js-tab5" role="tab" aria-controls="js-tab5">View Tab 5</a></li>
			</ul>
		</div><!-- //.tab-control -->

		<div class="tab-group">

			<div class="tab-content" id="js-tab1" role="tabpanel">
				<h2>Tab 1 Content</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
			</div><!-- //.tab-content -->

			<div class="tab-content" id="js-tab2" role="tabpanel">
				<h2>Tab 2 Content</h2>
				<p>In tincidunt tempor risus gravida tincidunt.</p>
			</div><!-- //.tab-content -->

			<div class="tab-content" id="js-tab3" role="tabpanel">
				<h2>Tab 3 Content</h2>
				<p>Suspendisse eget commodo erat. Donec a metus fringilla, pharetra ipsum nec, aliquet felis. </p>
			</div><!-- //.tab-content -->

			<div class="tab-content" id="js-tab4" role="tabpanel">
				<h2>Tab 4 Content</h2>
				<p>Aenean eu nibh nisl. Nulla ornare condimentum erat, et rhoncus urna euismod a.</p>
			</div><!-- //.tab-content -->

			<div class="tab-content" id="js-tab5" role="tabpanel">
				<h2>Tab 5 Content</h2>
				<p>Duis sollicitudin consequat lorem eu sagittis.</p>
			</div><!-- //.tab-content -->

		</div><!-- //.tab-group -->

	</div><!-- //.tabs -->
	`);

	globalContainer = container;
	style = injectCSS(`${__dirname}/../../dist/index.css`);
});

afterEach(() => {
	document.body.removeChild(style);
	document.body.removeChild(globalContainer);
});

test.each(['horizontal', 'vertical'])('%s tabs works', async (orientation) => {
	const onCreate = jest.fn();
	const onTabChange = jest.fn();

	new Tabs('.tabs', {
		onCreate,
		onTabChange,
		orientation,
	});

	expect(onTabChange).toHaveBeenCalled();

	// reset onTabChange mock because at this point it has been called multiple times
	onTabChange.mockReset();

	expect(onCreate).toHaveBeenCalledTimes(1);

	const [, controlTab2, controlTab3] = screen.getAllByRole('tab');
	const [tabContent1, tabContent2, tabContent3] = screen.getAllByRole('tabpanel', {
		hidden: true,
	});

	userEvent.click(controlTab2);

	expect(onTabChange).toHaveBeenCalled();
	expect(tabContent1).not.toBeVisible();
	expect(tabContent2).toBeVisible();

	userEvent.click(controlTab3);

	expect(tabContent3).toBeVisible();
	expect(tabContent1).not.toBeVisible();
	expect(tabContent2).not.toBeVisible();

	// markup is valid after interactions
	expect(await axe(document.querySelector('.tabs'))).toHaveNoViolations();
});

test.each(['horizontal', 'vertical'])('%s markup is accessible', async (orientation) => {
	new Tabs('.tabs', { orientation });

	expect(await axe(document.querySelector('.tabs'))).toHaveNoViolations();
});

test('destroy works', () => {
	const tabsHTML = globalContainer.innerHTML;
	const onTabChange = jest.fn();
	const tabs = new Tabs('.tabs', {
		onTabChange,
	});
	onTabChange.mockReset();

	const controlTab2 = screen.getAllByRole('tab')[1];
	userEvent.click(controlTab2);
	expect(onTabChange).toHaveBeenCalled();
	onTabChange.mockReset();

	tabs.destroy();
	expect(tabsHTML).toEqual(globalContainer.innerHTML);

	userEvent.click(controlTab2);
	expect(onTabChange).not.toHaveBeenCalled();
});
