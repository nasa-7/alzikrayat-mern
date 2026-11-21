const Joi = require('joi');

/** Joi schemas for every request body that writes data. */
const schemas = {
  register: Joi.object({
    firstName: Joi.string().trim().pattern(/^[A-Za-z ]+$/).max(50).required()
      .messages({ 'string.pattern.base': 'First name must contain letters only' }),
    lastName: Joi.string().trim().pattern(/^[A-Za-z ]+$/).max(50).required()
      .messages({ 'string.pattern.base': 'Last name must contain letters only' }),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(100).required(),
    location: Joi.string().trim().max(100).allow(''),
    occupation: Joi.string().trim().max(100).allow(''),
    description: Joi.string().trim().max(500).allow(''),
  }),
  login: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  }),
  photo: Joi.object({
    title: Joi.string().trim().max(200).required(),
    description: Joi.string().trim().max(2000).allow(''),
  }),
  comment: Joi.object({
    comment: Joi.string().trim().min(1).max(1000).required(),
  }),
};

/** Returns middleware validating req.body against the named schema (400 on failure). */
const validate = (name) => (req, res, next) => {
  const { value, error } = schemas[name].validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map((d) => d.message.replace(/"/g, '')),
    });
  }
  req.body = value;
  return next();
};

module.exports = { validate };
