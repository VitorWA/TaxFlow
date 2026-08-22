> Reconstructed from preexisting work on `feature/auth-pages`. Checked implementation
> tasks are evidenced by the working-tree diff. Review tasks remain open until their
> named validation is performed against this captured change.

## 1. Local Application Foundation

- [x] 1.1 Scaffold the Laravel API with Sanctum and MySQL support under `backend/`
- [x] 1.2 Add user, session, cache, queue, and personal access token migrations
- [x] 1.3 Add Compose services, health dependency, persistent database volume, and API startup migrations
- [x] 1.4 Add versionable environment examples, ignore local secrets, and document local startup
- [x] 1.5 Limit frontend bind mounts to runtime source and configuration files

## 2. Authentication

- [x] 2.1 Implement registration validation, password hashing, normalized account persistence, and duplicate-email errors
- [x] 2.2 Implement session login, current-user lookup, logout, and CSRF-aware frontend requests
- [x] 2.3 Add the React authentication provider and protect application routes
- [x] 2.4 Connect registration and login forms to the API with loading and error states
- [x] 2.5 Replace shell placeholders with authenticated account data and connect logout

## 3. Navigation

- [x] 3.1 Add persisted desktop sidebar collapse and expansion controls
- [x] 3.2 Preserve accessible labels and tooltips in icon-only navigation
- [x] 3.3 Add the mobile drawer, backdrop dismissal, close control, and route dismissal
- [ ] 3.4 Verify sidebar behavior and absence of overlap on supported desktop and mobile viewports

## 4. CNPJ Compatibility

- [x] 4.1 Add frontend normalization, formatting, and numeric/alphanumeric CNPJ validation
- [x] 4.2 Add independent Laravel validation and normalized persistence
- [x] 4.3 Apply CNPJ behavior to registration and account-recovery inputs
- [x] 4.4 Confirm official numeric and alphanumeric examples in automated tests

## 5. Validation And Review

- [x] 5.1 Run the Laravel test suite (6 passed, 18 assertions)
- [x] 5.2 Build the React production bundle successfully with Vite
- [ ] 5.3 Verify the complete CSRF registration, login, current-user, and logout flow against the running Compose stack
- [ ] 5.4 Run `mashure-review` against this captured change and resolve or accept its findings
