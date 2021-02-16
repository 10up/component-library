describe('tooltip', () => {
	beforeEach(() => {
		cy.visit('/components/navigation/');
	});

	it('works properly', () => {
		// this should only be visible in lower resolution
		cy.findByText('Primary Menu').should('not.be.visible');

		cy.findByText('Our Work').click();
		cy.findByText('WordPress').should('be.visible').click();
		cy.findByText('Plugins').should('be.visible');
		cy.findByText('WordPress').click();
		cy.findByText('Plugins').should('not.be.visible');
		cy.findByText('Our Work').click();
		cy.findByText('WordPress').should('not.be.visible');

		cy.findByText('Blog').click();
		cy.findByText('Blog Post 1').should('be.visible');
		cy.findByText('Blog').click();
		cy.findByText('Blog Post 1').should('not.be.visible');
	});

	it('works properly in small viewports', () => {
		cy.viewport(600, 600);

		cy.findByText('Primary Menu').should('be.visible').click();
		cy.findByText('About Us').should('be.visible');
		cy.findByText('Our Work').click();
		cy.findByText('WordPress').should('be.visible').click();
		cy.findByText('Plugins').should('be.visible');
		cy.findByText('WordPress').click();
		cy.findByText('Plugins').should('not.be.visible');
		cy.findByText('Our Work').click();

		cy.findByText('Blog').click();
		cy.findByText('Blog Post 1').should('be.visible');
		cy.findByText('Blog').click();
		cy.findByText('Blog Post 1').should('not.be.visible');
	});
});
