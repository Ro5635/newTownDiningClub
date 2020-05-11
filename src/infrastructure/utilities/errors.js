
// eslint-disable-next-line max-classes-per-file
class SecurityConstraintError extends Error {}
class InvalidAuthenticationCredentialsError extends Error {}
class ValidationConstraintError extends Error {}

// Persistence Errors
class NonExistentItemError extends Error {}

// Application layer Errors
class InvalidOperationError extends Error {}

const errors = {
  SecurityConstraintError,
  ValidationConstraintError,
  InvalidAuthenticationCredentialsError,
  NonExistentItemError,
  InvalidOperationError,
};

export default errors;
