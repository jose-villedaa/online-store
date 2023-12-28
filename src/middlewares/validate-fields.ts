import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';

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

export default validateFields;
