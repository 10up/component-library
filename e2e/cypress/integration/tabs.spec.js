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
});
