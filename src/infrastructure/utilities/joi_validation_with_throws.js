// By default JOI validation just returns a big mess,
// this utility makes it throw in the event that there is a validation failure

import errors from './errors';

const { ValidationConstraintError } = errors;

const throws = ({ error, value }) => {
  if (error) {
    throw new ValidationConstraintError(error.toString());
  }
  return value;
};

const validate = (obj, definition, config = {}) => throws(
  definition.validate(obj, { ...config, abortEarly: config.abortEarly || false }),
);


export default validate;
