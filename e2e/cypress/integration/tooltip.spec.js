describe('tooltip', () => {
	beforeEach(() => {
		cy.visit('/components/tooltips/');
	});

	it.skip('toggles a tooltip on a span', () => {
		cy.findByText('Tooltip Trigger span').trigger('mouseover');
		cy.findByText('Tooltip Trigger span content').should('be.visible');
	});
});
