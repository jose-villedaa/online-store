import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

const { validationResult } = require('express-validator');

const validateFields = (req: ExpressRequest, res : ExpressResponse, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => (
      { [error.param]: error.msg }
    ));
    return res.status(422).json({ errors: formattedErrors });
  }

  return next();
};

module.exports = {
  validateFields,
};
