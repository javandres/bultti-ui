// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getTestElement', (selector, options = {}) => {
    return cy.get(`[data-cy~="${selector}"]`, options);
});

Cypress.Commands.add('loginAdmin', () => {
    hslLogin();
    cy.getTestElement('authInfo').should('exist');
});

// TODO: add logins for other roles, parameterize hslIdLogin to handle different role logins?
const hslLogin = () => {
    const AUTH_URI = Cypress.env('CYPRESS_HSLID_AUTH_URI');
    const HSLID_CLIENT_ID = Cypress.env('CYPRESS_HSLID_CLIENT_ID');
    const HSLID_CLIENT_SECRET = Cypress.env('CYPRESS_HSLID_CLIENT_SECRET');
    const AUTH_SCOPE = Cypress.env('CYPRESS_AUTH_SCOPE');

    let HSLID_USERNAME;
    let HSLID_PASSWORD;
    HSLID_USERNAME = Cypress.env('CYPRESS_HSLID_TESTING_USERNAME');
    HSLID_PASSWORD = Cypress.env('CYPRESS_HSLID_TESTING_PASSWORD');
    const authHeader = `Basic ${btoa(`${HSLID_CLIENT_ID}:${HSLID_CLIENT_SECRET}`)}`;

    Cypress.log({
        name: `HSL ID login as admin`,
    });

    const options = {
        method: 'POST',
        url: AUTH_URI,
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: true, // we are submitting a regular form body
        body: {
            scope: AUTH_SCOPE,
            grant_type: 'password',
            username: HSLID_USERNAME,
            password: HSLID_PASSWORD,
        },
    };

    cy.request(options).then((response) => {
        const { access_token } = response.body;

        expect(response.status).to.eq(200);
        expect(access_token).to.be.ok;
        // testing = QueryParams.testing
        cy.visit(`/afterLogin?code=${access_token}&is_test=true`);
        cy.wait(1000);
    });
};