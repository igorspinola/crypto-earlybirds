# Coding Principles

These principles should guide new code in this repository.

## Clean Code

- Prefer small functions with one clear responsibility.
- Keep names explicit and domain-oriented.
- Remove dead code instead of leaving commented blocks.
- Avoid hidden side effects in helpers and serializers.
- Keep error messages clear and actionable for API consumers.

## English Code

- Write variables, functions, classes, files, DTOs, and database-facing code in English.
- User-facing messages may stay in Portuguese when the product surface requires it.
- Prefer domain names over generic names: `passwordResetToken` instead of `tokenData`, `authenticatedUser` instead of `data`.

## Object Calisthenics

- Favor one level of indentation per method by using early returns and guard clauses.
- Avoid `else` after a return or throw.
- Wrap primitives when a domain concept is reused or carries behavior.
- Keep collections encapsulated behind intention-revealing methods when business rules grow.
- Prefer small service methods that express one business action.

## NestJS Backend

- Controllers should only handle HTTP concerns: decorators, status codes, cookies, and DTO boundaries.
- Services should contain business rules and persistence orchestration.
- DTOs should validate incoming data and should not be reused as database entities.
- Never return sensitive fields such as `passwordHash` or reset token hashes.
- Prefer explicit serializers for API responses.
- Keep authentication and authorization checks declarative with guards and decorators.

## Control Flow

- Use guard clauses for invalid states.
- Prefer positive conditions when they improve readability.
- Keep nested `if` blocks shallow; extract functions when the branching becomes hard to scan.
- Throw specific NestJS exceptions at the boundary where the failure is understood.

## Verification

- Run the smallest meaningful validation after a change.
- For backend changes, prefer `npm run build` first, then targeted endpoint checks when the dev server and database are available.
