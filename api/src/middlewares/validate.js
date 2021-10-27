const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArray = errors.array().map((err) => err.msg);
    return res.status(422).json({ error: true, message: errorsArray });
  }

  next();
};
