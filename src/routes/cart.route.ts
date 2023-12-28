import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '@middlewares/validate-fields';
import validateJWT from '@middlewares/validate-jwt';
import validateRols from '@middlewares/validate-rols';
import validateProductAvailability from '@middlewares/validate-stock';
import {
  getCart,
  postCart,
  putCart,
} from '../controllers/cart.controller';

const { hasRole } = validateRols;

const router = Router();

router.get('/show', getCart);

router.post('/add', [
  validateJWT,
  hasRole('USER_ROLE'),
  check('cart', 'Name is required').not().isEmpty(),
  validateProductAvailability,
  validateFields,
], postCart);

router.put('/edit/:id', [
  validateJWT,
  hasRole('USER_ROLE'),
  check('id', 'ID is required').not().isEmpty(),
  check('cart', 'Name is required').not().isEmpty(),
  validateProductAvailability,
  validateFields,
], putCart);

export default router;
