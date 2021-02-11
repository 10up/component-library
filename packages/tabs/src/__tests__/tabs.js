import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tabs } from '..';

beforeEach(() => {
	document.body.innerHTML = `
		<div class="tabs">
		<div class="tab-control">
			<ul class="tab-list" role="tablist">
				<li class="tab-item"><a href="#js-tab1" role="tab" aria-controls="js-tab1" data-testid="tab1">View Tab 1</a></li>
				<li class="tab-item"><a href="#js-tab2" role="tab" aria-controls="js-tab2" data-testid="tab2">View Tab 2</a></li>
				<li class="tab-item"><a href="#js-tab3" role="tab" aria-controls="js-tab3" data-testid="tab3">View Tab 3</a></li>
				<li class="tab-item"><a href="#js-tab4" role="tab" aria-controls="js-tab4" data-testid="tab4">View Tab 4</a></li>
				<li class="tab-item"><a href="#js-tab5" role="tab" aria-controls="js-tab5" data-testid="tab5">View Tab 5</a></li>
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
	`;

	// inject css in the dom
	/* const cssFile = fs.readFileSync(path.resolve(__dirname, '../../dist/index.css'), 'utf8');
	const style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssFile;
	document.body.append(style); */
});

test('horizontal tabs works', () => {
	const onCreate = jest.fn();
	const onTabChange = jest.fn();

	new Tabs('.tabs', {
		onCreate,
		onTabChange,
	});

	expect(onCreate).toHaveBeenCalledTimes(1);
	// should onTabChange be called on initialization?
	expect(onTabChange).toHaveBeenCalledTimes(5);
	userEvent.click(screen.getByTestId('tab2'));
	expect(onTabChange).toHaveBeenCalledTimes(6);
	expect(document.getElementById('js-tab1')).not.toHaveClass('is-active');
	expect(document.getElementById('js-tab2')).toHaveClass('is-active');
});

test('vertical tabs works', () => {
	const onCreate = jest.fn();
	const onTabChange = jest.fn();

	new Tabs('.tabs', {
		onCreate,
		onTabChange,
		orientation: 'vertical',
	});

	expect(onCreate).toHaveBeenCalledTimes(1);
	// should onTabChange be called on initialization?
	expect(onTabChange).toHaveBeenCalledTimes(5);
	userEvent.click(screen.getByTestId('tab2'));
	expect(onTabChange).toHaveBeenCalledTimes(6);
	expect(document.getElementById('js-tab1')).not.toHaveClass('is-active');
	expect(document.getElementById('js-tab2')).toHaveClass('is-active');
});

test.skip('markup is accessible', async () => {
	new Tabs('.tabs');

	expect(await axe(document.body.innerHTML)).toHaveNoViolations();
});
