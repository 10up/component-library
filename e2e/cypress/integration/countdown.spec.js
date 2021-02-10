describe('countdown', () => {
	beforeEach(() => {
		cy.visit('/components/countdowntimer/');
	});

	it('renders a countdown', () => {
		cy.get('.tenup-countdown-timer-years').should('be.visible').contains('1 year');
		cy.get('.tenup-countdown-timer-weeks').should('be.visible').contains('0 weeks');
		cy.get('.tenup-countdown-timer-days').should('be.visible').contains('0 days');
		cy.get('.tenup-countdown-timer-hours').should('be.visible').contains('23 hours');
	});
});
