describe('reading position', () => {
	beforeEach(() => {
		cy.visit('/components/readingposition/');
	});

	it('scrolling updates progress bar', () => {
		cy.get('progress').should('have.attr', 'value').and('equal', '0');
		cy.scrollTo(0, 500);
		cy.get('progress').should('have.attr', 'value').and('not.equal', '0');
	});
});
