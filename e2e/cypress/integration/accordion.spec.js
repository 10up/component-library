describe('accordion', () => {
	beforeEach(() => {
		cy.visit('/components/accordion/');
	});

	it('open and close', () => {
		cy.findByText(/accordion header 1$/i).click();
		cy.findByText(/here the content of 1st tab non-nested$/i).should('be.visible');
		cy.findByText(/accordion header 1$/i).click();
		cy.findByText(/here the content of 1st tab non-nested$/i).should('not.be.visible');
	});

	it('can open and close nested accordions', () => {
		cy.findByText(/accordion header with nested Accordion$/i).click();
		cy.findAllByText(/nested accordion header button$/i)
			.should('be.visible')
			.click({ multiple: true });
		cy.findAllByText(/nested accordion heading$/i).should('be.visible');

		cy.findAllByText(/nested accordion header button$/i).click({ multiple: true });

		cy.findAllByText(/nested accordion heading$/i).should('not.be.visible');
		cy.findByText(/accordion header with nested Accordion$/i).click();
		cy.findAllByText(/nested accordion heading$/i).should('not.be.visible');
	});
});
