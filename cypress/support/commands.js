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
  cy.getTestElement('operator-select').should.exist
  cy.getTestElement('operator-select').click()
  cy.getTestElement('operator-select_999').click()
  cy.getTestElement('operator-select_selected')
    .text()
    .should('equal', 'Bultin Testiliikennöitsijä')
})

// Select the test season. Test data needs to have been generated at least once
// for this to work. Test season is not deleted when test data is removed.
Cypress.Commands.add('selectTestSeason', () => {
  cy.getTestElement('season-select').should.exist
  cy.getTestElement('season-select').click()
  cy.getTestElement('season-select_TESTIKAUSI').click()
  cy.getTestElement('season-select_selected').text().should('equal', 'TESTIKAUSI')
})

// Selects test operator and season. Should be run at the start of each test.
Cypress.Commands.add('selectTestSettings', () => {
  cy.selectTestOperator()
  cy.selectTestSeason()
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

// Directly creates a new draft pre-inspection.
Cypress.Commands.add('createTestPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('create_new_pre_inspection').click()
  cy.getTestElement('inspection_type_title').contains('ennakkotarkastus', {
    matchCase: false,
  })
  cy.getTestElement('inspection_status').should('contain.text', 'Muokattavissa')
})

// Opens an existing draft pre-inspection if one exists. Creates a new one if not.
Cypress.Commands.add('openTestPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (selectInspection.find('[data-cy*="open_pre_inspection_Draft"]').length !== 0) {
        cy.getTestElement('open_pre_inspection_Draft', '*').first().click()
      } else {
        cy.getTestElement('create_new_pre_inspection').click()
      }
    })
  })

  cy.getTestElement('inspection_type_title').contains('ennakkotarkastus', {
    matchCase: false,
  })
  cy.getTestElement('inspection_status').should('contain.text', 'Muokattavissa')
})

// Brings a draft pre-inspection to InReview. Will fail if an InReview pre-
// inspection already exists.
Cypress.Commands.add('createTestReviewPreInspection', () => {
  cy.openTestPreInspection()

  cy.getTestElement('departure_blocks_section').click()

  cy.getTestElement('departure_blocks').then((depBlocks) => {
    if (depBlocks.find('[data-cy~="fetch_departure_blocks"]').length !== 0) {
      cy.getTestElement('fetch_departure_blocks').click()
    }
  })

  cy.getTestElement('departure_blocks_table_row', '*').should('have.length.at.least', 1)

  cy.getTestElement('submit_inspection').click()

  cy.getTestElement('inspection_status').should('contain.text', 'Käsittelee tietoja')
  cy.getTestElement('inspection_status').should('contain.text', 'Hyväksyttävänä')
})

// Opens a currently InReview pre-inspection or creates a new one if one does not exist.
Cypress.Commands.add('openTestReviewPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (selectInspection.find('[data-cy~="open_pre_inspection_InReview"]').length !== 0) {
        cy.getTestElement('open_pre_inspection_InReview').click()
      } else {
        cy.createTestReviewPreInspection()
      }
    })
  })

  cy.getTestElement('inspection_status').should('contain.text', 'Hyväksyttävänä')
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
