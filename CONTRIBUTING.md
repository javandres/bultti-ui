# Bultti conventions

## Code conventions

- Use `<button>` element when you have an element which the user interacts with through clicking (never use eg. `<div>` unless necessary).
- Use `{}` for empty objects
- Use `''` for empty strings

## Typescript

- When typing components or other functions which receive function arguments, use `unknown` for the return type of the function argument when the consumer doesn't care about what it returns. Use `void` if you want to indicate that the function doesn't return anything
