// Data validation packages like Joi are essential tools that help ensure the data coming
// into your application is correct, safe, and properly formatted before you process it.

// Keep in mind that to run mongoose schema validation, you need to run the controller code as well.
// This controller code could crash if the client sends the wrong request body.
// There are also some controller operations that are CPU intensive, such as password hashing.
// A hacker could take advantage of this by sending many requests that will overload the processor.
// Because of this, it’s common practice to validate an incoming request.

// Celebrate is essentially a middleware wrapper around Joi that makes it work
// seamlessly with Express.js applications. Here's why it's particularly useful:
// Express Middleware Integration, Automatic Error Handling, Multiple Validation Points.

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// validator.isURL() is stricter than Joi's built-in URI validator. It catches more invalid URL formats.
// value: The actual URL string that needs to be validated.
// helpers: Joi's built-in helper object that provides error-handling methods.
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  // 'string.uri' is the error code that matches Joi's built-in URI validation errors.
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  // If the request doesn’t pass the described validation, celebrate will pass
  // it on to the error handler but not to the controller. celebrate has a special
  // errors() middleware for sending errors to the client.
  return helpers.error("string.email");
};

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatarUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatarUrl" field must be filled in',
      "string.uri": 'the "avatarUrl" field must be a valid url',
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// Multiple Validation Points:
const validateId = celebrate({
  // On top of validating the request body, celebrate also allows you to validate headers, parameters, or req.query.
  params: Joi.object().keys({
    // hex strings of length 24. Perfect for MongoDB ObjectIds!
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateId,
};

// Hexadecimal (or "hex") is a number system that uses 16 digits instead of the usual 10:
// Regular numbers (decimal): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
// Hexadecimal: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F
// Think of hex like a special alphabet for computers.
// Just like we use 26 letters (A-Z) to write words, computers often use these
// 16 "hex digits" to represent data efficiently.
