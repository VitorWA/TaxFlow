> Reconstructed from the preexisting working tree on `feature/auth-pages`. Items
> labeled as rationale are inferred from the implementation and require confirmation
> during `mashure-review`.

## Context

The repository began as a Vite/React prototype with browser-only form behavior and
mock account data. The captured working tree adds a server, persistent data model,
authentication boundary, and shared shell behavior. See `proposal.md` for the
motivation and the four delta specs for observable contracts.

The implementation must remain easy for another developer to start locally and
must preserve compatibility with an earlier hand-created `users` table observed in
the migration logic.

## Goals / Non-Goals

**Goals:**

- Establish one local service topology and versioned schema history.
- Use Laravel's native session security model for the browser application.
- Keep frontend and backend CNPJ validation behavior aligned.
- Centralize identity and navigation state across protected React routes.

**Non-Goals:**

- Production orchestration, secret management, backups, or high availability.
- Password reset/email recovery delivery; the current recovery page only validates
  input and presents a simulated success state.
- Roles, permissions, email verification, or persistence for fiscal workflows.

## Decisions

### Use Laravel as a separate API service

The backend lives under `backend/` and exposes JSON routes while the existing React
application remains the frontend. This preserves the prototype and gives future
backend work Laravel conventions, migrations, validation, and tests.

Alternative considered: replace the React app with Blade views. The captured diff
does not do this because it would discard the existing routed frontend.

### Use Sanctum stateful SPA sessions

The frontend obtains a CSRF cookie before state-changing requests and sends browser
credentials through Vite's same-origin proxy. Laravel authenticates with the `web`
guard and database-backed sessions.

Inferred rationale: same-origin cookie sessions avoid storing bearer tokens in
browser storage for this first-party web application. Token authentication remains
available through the installed Sanctum package but is not part of this contract.

### Use MySQL migrations as the shared schema source of truth

Compose runs MySQL 8.4 with a named volume. The API entrypoint waits for the
database and runs migrations before serving requests. The user migration creates a
fresh Laravel-compatible table or upgrades the observed legacy `password_hash`
shape in place.

Alternative considered: share a database dump. Migrations are used because they are
reviewable, repeatable, and do not distribute local data or credentials.

### Keep frontend authentication in one context

An authentication provider loads the current user, exposes login/logout operations,
and drives a route guard. The shared shell consumes the same identity rather than
maintaining page-local placeholders.

### Keep navigation state in the application shell

The shell owns desktop collapse and mobile drawer state so every route rendered
inside it behaves consistently. Desktop preference is stored in `localStorage`;
mobile navigation uses a transient drawer and backdrop.

### Implement the CNPJ algorithm at both trust boundaries

The browser formats and gives immediate feedback, while Laravel independently
normalizes and validates before persistence. Both implementations use uppercase
ASCII character value minus 48 with the official modulo-11 weights; the last two
positions remain numeric.

Alternative considered: validate only in React. Server-side validation is retained
because clients can bypass browser code.

## Risks / Trade-offs

- [The PHP development server and Vite proxy are development-only] -> Define a
  production web server, TLS, cookie, and proxy configuration before deployment.
- [The backend source and dependency volumes favor live local development] -> Build
  immutable production images separately rather than deploying this Compose file.
- [CNPJ logic exists in JavaScript and PHP] -> Keep shared official examples in both
  test suites and review both implementations when the rule changes.
- [Frontend automated coverage is currently absent] -> Add component or end-to-end
  tests for route guarding, auth forms, and responsive navigation.
- [Recovery UI can imply delivery that does not exist] -> Treat recovery delivery as
  a separate capability before exposing it as functional in production.

## Migration Plan

1. Create local `.env` values from `.env.example`.
2. Build and start the Compose project; allow the API entrypoint to apply migrations.
3. Verify health, registration, login, current-session lookup, and logout.
4. Verify existing user rows are retained if upgrading an earlier local schema.
5. Roll back locally by stopping the stack; remove the named volume only when loss
   of local data is intentional. Application rollback with migrated production data
   requires a separately reviewed database rollback plan.

## Open Questions

- Which production hosting and secret-management platform will be used?
- Should CNPJ become mandatory or unique once organization ownership is modeled?
