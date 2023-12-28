import login from '@controllers/auth.controller';
import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '@middlewares/validate-fields';
import loginLimiter from '@middlewares/rate-limit';

const router = Router();

router.post('/login', [
  check('email', 'The email is not valid').isEmail(),
  check('password', 'The password is required and must be at least 8 characters long, include an uppercase and a lowercase letter, a number and a special character')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'i'),
  validateFields,
  loginLimiter,
], login);

export default router;
