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

// Visits a page and set up spy on console.error. This allows us to assert that
// there were no errors.
Cypress.Commands.add('visitAndSpy', (path) => {
  return cy.visit(path, {
    onBeforeLoad: (win) => {
      cy.spy(win.console, 'error').as('consoleError')
    },
  })
})

Cypress.Commands.add('getTestElement', (selector, match = '~', options = {}) => {
  return cy.get(`[data-cy${match}="${selector}"]`, options)
})

Cypress.Commands.add('loginAdmin', () => {
  hslLogin({ role: 'ADMIN' })
  cy.getTestElement('authInfo').should('exist')
})

Cypress.Commands.add('loginHSL', () => {
  hslLogin({ role: 'HSL' })
  cy.getTestElement('authInfo').should('exist')
})

Cypress.Commands.add('loginOperator', () => {
  hslLogin({ role: 'OPERATOR' })
  cy.getTestElement('authInfo').should('exist')
})

// Select the test operator. Test data needs to have been generated at least once
// for this to work. Test operator is not deleted when test data is removed.
Cypress.Commands.add('selectTestOperator', () => {
  cy.getTestElement('operator_select').should.exist
  cy.getTestElement('operator_select').click()
  cy.getTestElement('operator_select_999').click()
  cy.getTestElement('operator_select_selected')
    .text()
    .should('equal', 'Bultin Testiliikennöitsijä')
})

// Select the test season. Test data needs to have been generated at least once
// for this to work. Test season is not deleted when test data is removed.
Cypress.Commands.add('selectTestSeason', () => {
  cy.getTestElement('season_select').should.exist
  cy.getTestElement('season_select').click()
  cy.getTestElement('season_select_TESTIKAUSI').click()
  cy.getTestElement('season_select_selected').text().should('equal', 'TESTIKAUSI')
})

// Selects test operator and season. Should be run at the start of each test.
Cypress.Commands.add('selectTestSettings', () => {
  cy.selectTestOperator()
  cy.selectTestSeason()
})

/**
 * Sets a filter value of TableFiltersControl and filters with it
 * @param {string} value - Value to filter with
 * @param {string} key - Key of the dropdown item
 * @param {string} scope - Scope of TableFiltersControl (see which testId was given to TableFiltersControl)
 * @param {string} expectedValue - Check that after filtering, the expected value is found from the results
 */
Cypress.Commands.add('filterTableByValueAndKey', (value, key, scope, expectedValue) => {
  if (!value || !key || !scope) {
    console.log(
      `Missing some required props of filterTableByValueAndKey. Props given: ${value}, ${key}, ${scope}`
    )
  }
  cy.getTestElement(`${scope}_add_filter`).click()
  cy.getTestElement(`${scope}_filter_dropdown`).click()
  cy.getTestElement(`${scope}_filter_dropdown_sanctionReason`).click()
  cy.getTestElement(`${scope}_filter_input_field`).type(value)
  cy.getTestElement(`${scope}_report_filtering_apply`).click()

  cy.getTestElement(`${scope}_table_filtered_rows`).contains(expectedValue)
})

// Generates test data. Test data can be generated continuously, it will not be
// created "on top" of existing test data.
Cypress.Commands.add('generateTestData', () => {
  cy.visit('/dev-tools')
  cy.getTestElement('create_test_data').click()

  cy.waitUntil(
    () =>
      // Wait until test data has loaded.
      cy
        .getTestElement('create_test_data_loading', '~', { timeout: 240000 })
        .should('have.length', 0),
    {
      timeout: 240000,
    }
  )

  cy.getTestElement('info_message_error').should('not.exist')

  cy.visit('/')
})

/**
 * @param {Object} props
 * @param {String} props.role ADMIN / HSL / OPERATOR
 */
const hslLogin = ({ role }) => {
  // The following two env vars come from the cypress.json file
  const AUTH_URI = Cypress.env('HSLID_AUTH_URI')
  const AUTH_SCOPE = Cypress.env('HSLID_AUTH_SCOPE')
  // The rest of the env vars come from the .env file.
  const HSLID_CLIENT_ID = Cypress.env('CYPRESS_HSLID_CLIENT_ID')
  const HSLID_CLIENT_SECRET = Cypress.env('CYPRESS_HSLID_CLIENT_SECRET')
  const HSLID_USERNAME = Cypress.env('CYPRESS_HSLID_TESTING_USERNAME')
  const HSLID_PASSWORD = Cypress.env('CYPRESS_HSLID_TESTING_PASSWORD')

  const authHeader = `Basic ${btoa(`${HSLID_CLIENT_ID}:${HSLID_CLIENT_SECRET}`)}`

  Cypress.log({
    name: `HSL ID login as ${role}`,
  })

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
  }

  cy.request(options).then((response) => {
    const { access_token } = response.body

    expect(response.status).to.eq(200)
    expect(access_token).to.be.ok

    cy.visit(`/afterLogin?code=${access_token}&isTest=true&role=${role}`)
    cy.wait(1000)
  })
}
