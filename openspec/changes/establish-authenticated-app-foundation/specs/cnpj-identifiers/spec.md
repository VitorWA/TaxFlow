## Purpose

Support both legacy numeric CNPJ values and Brazil's alphanumeric CNPJ format
consistently at data entry, API validation, and persistence boundaries.

## ADDED Requirements

### Requirement: CNPJ input supports numeric and alphanumeric values
The system SHALL accept CNPJ bases containing uppercase letters or digits in the
first twelve positions and SHALL require numeric check digits in the final two
positions.

#### Scenario: User enters an alphanumeric CNPJ
- **WHEN** the user types letters, digits, or punctuation into a CNPJ field
- **THEN** the field uppercases valid characters, removes unsupported characters, limits the identifier to fourteen characters, and displays standard CNPJ punctuation

#### Scenario: User enters a legacy numeric CNPJ
- **WHEN** the user supplies a valid fourteen-digit numeric CNPJ
- **THEN** the system accepts it under the same validation and normalization flow

### Requirement: CNPJ validity is checked consistently
The frontend and API SHALL calculate both modulo-11 check digits using the numeric
value of each character and SHALL reject invalid formats, repeated bases, or
incorrect check digits.

#### Scenario: Valid official-format identifier
- **WHEN** a user submits `12.ABC.345/01DE-35`
- **THEN** the frontend and API accept the identifier as valid

#### Scenario: Incorrect check digits
- **WHEN** a user submits `12.ABC.345/01DE-99`
- **THEN** the system rejects the identifier and reports a CNPJ validation error

### Requirement: Stored CNPJ values are normalized
The API SHALL uppercase CNPJ values and remove formatting before persistence while
retaining all fourteen identifier characters.

#### Scenario: Alphanumeric CNPJ registration
- **WHEN** an account is created with `12.ABC.345/01DE-35`
- **THEN** the stored account value is `12ABC34501DE35`
