const ApiError = require('../utils/ApiError');

/**
 * Middleware de validation Joi.
 * Usage : validate(schema) ou validate(schema, 'query')
 */
module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return next(ApiError.badRequest('Validation échouée', details));
  }
  req[source] = value;
  next();
};
