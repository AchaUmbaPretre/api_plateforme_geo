const Joi = require("joi");

const typeSchema = Joi.object({
  nom_type: Joi.string().min(3).max(50).required(),
  slug: Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().allow(null, "").max(255)
});

function validateType(req, res, next) {
  const { error } = typeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = validateType;
