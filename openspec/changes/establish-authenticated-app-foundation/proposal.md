> Captured from the preexisting working tree on branch `feature/auth-pages`. This
> proposal reconstructs the implemented behavior; inferred intent requires human
> confirmation during `mashure-review`.

## Why

TaxFlow needs a shared, reproducible application foundation so multiple developers
can run the same database-backed site and users can create and use real accounts.
The existing prototype also needs authenticated navigation and identifiers that
remain compatible with Brazil's alphanumeric CNPJ format.

## What Changes

- Add a Docker Compose local environment for the React frontend, Laravel API, and
  persistent MySQL database, with migrations applied when the API starts.
- Add session-based registration, login, current-user lookup, logout, and protected
  frontend routes using Laravel Sanctum's SPA authentication flow.
- Replace placeholder account data in the application shell with the authenticated
  user's data.
- Add desktop sidebar collapse with persisted preference and a mobile navigation
  drawer that can be opened and closed across shell-based screens.
- Accept, format, validate, normalize, and store numeric and alphanumeric CNPJ
  values using the official modulo-11 character-value calculation.
- Document local setup and provide versionable environment examples while keeping
  local credentials and database contents out of version control.
- Keep password/email recovery delivery, role-based authorization, production
  deployment, and fiscal feature persistence outside this change.

## Capabilities

### New Capabilities

- `local-development-environment`: Reproducible Docker-based startup of the frontend,
  Laravel API, migrations, and persistent MySQL storage.
- `user-authentication`: Account registration and session lifecycle shared between
  the React application and Laravel API.
- `application-navigation`: Protected application shell with authenticated account
  data and responsive, collapsible navigation.
- `cnpj-identifiers`: Numeric and alphanumeric CNPJ input, validation,
  normalization, and persistence.

### Modified Capabilities

None. The repository has no existing live OpenSpec capabilities.

## Impact

- Adds a Laravel 13 backend under `backend/`, backed by PHP 8.4, Sanctum, and MySQL
  8.4.
- Adds API routes under `/api/auth/*` and `/api/health`, plus Sanctum's CSRF cookie
  endpoint used by the frontend.
- Changes React routing, authentication forms, application shell, header, and
  sidebar behavior.
- Adds Docker images, environment contracts, database migrations, a named MySQL
  volume, and Vite proxy configuration.
- Captured reference: branch `feature/auth-pages`; no pull request reference was
  provided during capture.
