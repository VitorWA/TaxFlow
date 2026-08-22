## Purpose

Provide a reproducible local stack in which developers share the same application
schema and services without committing credentials or database contents.

## ADDED Requirements

### Requirement: The complete local stack starts with one Compose command
The project SHALL provide a Docker Compose environment containing the React
frontend, application API, and MySQL database.

#### Scenario: Developer starts a clean environment
- **WHEN** a developer supplies the documented environment values and starts the Compose project
- **THEN** the frontend is available on port 3000, the API starts after MySQL is healthy, and the database schema is migrated automatically

### Requirement: Local database data persists across routine restarts
The local environment SHALL store MySQL data in a named Docker volume and SHALL
keep database contents outside version control.

#### Scenario: Developer restarts containers
- **WHEN** the Compose containers are stopped and started without deleting volumes
- **THEN** previously stored application records remain available

### Requirement: Shared configuration contains no local secrets
The repository SHALL provide versionable environment examples and SHALL exclude
developer-specific environment files from version control.

#### Scenario: A second developer checks out the branch
- **WHEN** the developer creates local environment files from the examples
- **THEN** the same service topology and database schema can be created with locally chosen credentials
