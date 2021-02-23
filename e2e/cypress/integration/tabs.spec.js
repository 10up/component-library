describe('tabs', () => {
	beforeEach(() => {
		cy.visit('/components/tabs/');
	});

	it('opens and close horizontal tabs properly', () => {
		cy.findByText('View Tab 1').click();
		cy.findByText('Tab 1 Content').should('be.visible');

		cy.findByText('View Tab 2').click();
		cy.findByText('Tab 2 Content').should('be.visible');

		cy.findByText('View Tab 3').click();
		cy.findByText('Tab 3 Content').should('be.visible');

		cy.findByText('View Tab 4').click();
		cy.findByText('Tab 4 Content').should('be.visible');

		cy.findByText('View Tab 4').click();
		cy.findByText('Tab 4 Content').should('be.visible');
	});

	it('opens and close vertical tabs properly', () => {
		cy.findByText('View Vertical Tab 1').click();
		cy.findByText('Vertical Tab 1 Content').should('be.visible');

		cy.findByText('View Vertical Tab 2').click();
		cy.findByText('Vertical Tab 2 Content').should('be.visible');

		cy.findByText('View Vertical Tab 3').click();
		cy.findByText('Vertical Tab 3 Content').should('be.visible');

		cy.findByText('View Vertical Tab 4').click();
		cy.findByText('Vertical Tab 4 Content').should('be.visible');

		cy.findByText('View Tab 4').click();
		cy.findByText('Vertical Tab 4 Content').should('be.visible');
	});

	it('maitains focusable elements within the current tab', () => {
		cy.findByText('View Vertical Tab 1').click();
		// ensures there's only one tabpanel visible and it can find a link by role
		cy.get('.tabs').findByRole('tabpanel').findByRole('link');

		// links within the second tab should not be acessible
		cy.get('.tabs #js-tab2').findByRole('link').should('not.exist');
	});
});
