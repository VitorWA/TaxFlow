## Purpose

Give authenticated users consistent access to TaxFlow screens through a responsive
application shell whose navigation can be hidden when more workspace is needed.

## ADDED Requirements

### Requirement: Application routes require authentication
The system SHALL verify the current session before rendering dashboard, query,
history, favorites, alerts, reports, settings, result, or detail routes.

#### Scenario: Unauthenticated visitor opens a protected route
- **WHEN** a visitor without a valid session navigates to a protected route
- **THEN** the visitor is redirected to login and the requested path is retained for post-login navigation

#### Scenario: Authenticated user opens the application shell
- **WHEN** a user with a valid session opens a shell-based route
- **THEN** the header and sidebar display data from the authenticated account

### Requirement: Desktop navigation can be collapsed
The desktop application shell SHALL provide an icon control to collapse or expand
the sidebar and SHALL preserve that preference in the browser.

#### Scenario: User collapses the desktop sidebar
- **WHEN** the user activates the collapse control
- **THEN** the sidebar becomes an icon-only navigation rail, exposes labels through accessible names and tooltips, and the content area uses the released width

#### Scenario: User returns later
- **WHEN** the same browser loads the application after a collapse preference was saved
- **THEN** the sidebar restores the saved state

### Requirement: Mobile navigation behaves as a dismissible drawer
The mobile application shell SHALL provide controls to open and close navigation
without permanently covering the current page.

#### Scenario: User opens and dismisses mobile navigation
- **WHEN** the user opens the menu and then selects a destination, its close control, or the backdrop
- **THEN** the navigation drawer closes and the selected page remains usable
