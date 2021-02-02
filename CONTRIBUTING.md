# Code conventions

- Use `<button>` element when you have an element which the user interacts with through clicking (never use eg. `<div>` unless necessary).
- Use `{}` for empty objects
- Use `''` for empty strings
- Avoid using `any` type as much as you can. Only use it if you have to. For example when using useQueryData hook, give it a return type

### Typescript

- When typing components or other functions which receive function arguments, use `unknown` for the return type of the function argument when the consumer doesn't care about what it returns. Use `void` if you want to indicate that the function doesn't return anything

- When importing type from schema-types, use a `Type` suffix in the type name: `<typeName>Type`

# Ideal work flow

## Documenting a card

- Describe what is planned to be implemented
  - Bug fixes: steps to reproduce the bug, e.g.:
    1.  open edit pre-inspection page
    2.  set startDate, set endDate
        -> save button greyed out (should be green)

## Definition of Ready

- Task scope is not too large (split and link cards together if needed)
- Task is documented to wiki (if needed)
  - Document _what_ is going to be implemented, not _how_ implement it
    - However, before starting the task you should have a clear idea of how to implement it
- Task documentation (in wiki) is accepted by HSL
- UI design sketch isn't crucial but prefered when having to implement a lot of UI changes
  - In those cases, make the team and HSL approve it
- Task has labels and is assigned to the developer implementing it

## Definition of Done

- Task PR's are linked to the card and PR's have a link to the card
- Task is reviewed (code review + testing)
- Cypress automation tests are implemented (rule applies after we have started to use them)
- Review fixes are done
- Review fixes are reviewed
- New cards needed to be done are created to the backlog and linked to PR
- Reviewer merges PR and moves the card to the 'redy for demo' column

## Co-working practices

- Sprint backlog has the cards to be implemented in the current sprint (this way we have to constantly priorize tasks)
- If a card is on top of a column, it's the most priorized one of the column
- Try to have max 1 card in backlog's 'in progress bar' at once
- Priorize reviewing and fixing reviews: don't start a new task if there are cards in the review colmun. At the start of the day, check review column first
