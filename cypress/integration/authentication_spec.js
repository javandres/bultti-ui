describe.only('Authentication tests - admin user', () => {
    it('Cannot see unauthorized elements when not logged in', () => {
        cy.visit('/');
        cy.getTestElement('authInfo').should('not.exist');
    });

    it('Can log in with HSL ID', () => {
        cy.loginAdmin();

        cy.getTestElement('authInfo').should('exist');
        cy.getTestElement('userRole').contains('Admin');
    });

    it('Can log out', () => {
        cy.loginAdmin();

        cy.getTestElement('logoutButton')
            .should('exist')
            .click();

        cy.getTestElement('authInfo').should('not.exist');
        cy.getTestElement('userRole').should('not.exist');
    });
});

// TODO: describe('Authentication tests - hsl user', () => {...}
// TODO: describe('Authentication tests - operator', () => {...}