import validator from 'validator';

export const validatorEnum = {
  IS_NOT_EMPTY: isNotEmpty,
  IS_EMAIL: validator.isEmail,
  IS_TRUE: isTrue,
  IS_AUS_POST_CODE: isAustralianPostCode,
  IS_AUS_MOBILE_NUMBER: isAustralianMobileNumber,
  NO_VALIDATION: noValidation,
  NOT_ZERO: isNotZero,
  IS_MORE_THAN_TEN_CHARS: isMoreThanTenChars,
}

function isNotEmpty(input) {
  return validator.isLength(input, {min: 1, max: undefined});
}

function isTrue(input) {
  return validator.equals(input.toString(), 'true');
}

function isAustralianPostCode(input) {
  return validator.isInt(input, {min: 200, max:9999});
}

function isAustralianMobileNumber(input) {
  return validator.isInt(input, {min: 400000000, max: 499999999 });
}

function noValidation() {
  return true;
}

function isNotZero(input) {
  return !validator.equals(input.toString(), '0');
}

function isMoreThanTenChars(input) {
  return validator.isLength(input, {min: 10, max: 100});
}
