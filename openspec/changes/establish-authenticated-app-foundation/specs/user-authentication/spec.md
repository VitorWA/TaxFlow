## Purpose

Allow TaxFlow users to create accounts and maintain a secure browser session while
accessing application routes backed by the authenticated user identity.

## ADDED Requirements

### Requirement: A user can register an account
The system SHALL accept a name, email, and password of at least eight characters,
with optional company and CNPJ data, and SHALL store the password as a hash.

#### Scenario: Valid registration
- **WHEN** a visitor submits valid registration data with an unused email
- **THEN** the system creates the account and directs the visitor to login

#### Scenario: Invalid registration
- **WHEN** registration data violates a field rule or uses an existing email
- **THEN** the system rejects the request without creating an account and presents field-level errors

### Requirement: A registered user can manage a session
The system SHALL support login, current-user lookup, and logout through a
cookie-based browser session protected against CSRF.

#### Scenario: Valid login
- **WHEN** a registered user supplies the correct email and password
- **THEN** the system regenerates the session and returns the authenticated user

#### Scenario: Invalid login
- **WHEN** a visitor supplies credentials that do not match an account
- **THEN** the system returns an unauthorized response and does not create an authenticated session

#### Scenario: Current user lookup
- **WHEN** an authenticated browser requests its current account
- **THEN** the system returns that user's non-secret account data

#### Scenario: Logout
- **WHEN** an authenticated user logs out
- **THEN** the system invalidates the session and subsequent protected requests are unauthorized
