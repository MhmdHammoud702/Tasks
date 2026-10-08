export const VALIDATOR_REQUIRE = () => (value) => value.trim().length > 0

export const VALIDATOR_MINLENGTH = (minimumLength) => (value) =>
  value.length >= minimumLength

export const VALIDATOR_EMAIL = () => (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const validate = (value, validators = []) =>
  validators.every((validator) => validator(value))
