import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '@middlewares/validate-fields';
import validateJWT from '@middlewares/validate-jwt';
import validateRols from '@middlewares/validate-rols';
import { productExistsById } from '@helpers/db-validators';
import {
  deleteProduct,
  getBestSellingProducts,
  getProductById,
  getProducts,
  getSoldOutProducts,
  postProduct,
  putProduct,
} from '@controllers/product.controller';

const router = Router();

const { isAdmin } = validateRols;

router.get('/', getProducts);

router.get('/show/sold-out', [
  validateJWT,
  isAdmin,
], getSoldOutProducts);

router.get('/show/best-selling', [
], getBestSellingProducts);

router.get('/:id', [
  check('id', 'Not a valid Mongo ID').isMongoId(),
  check('id').custom(productExistsById),
  isAdmin,
  validateFields,
], getProductById);

router.post('/add', [
  validateJWT,
  check('name', 'The name is mandatory').not().isEmpty(),
  isAdmin,
  validateFields,
], postProduct);

router.put('/edit/:id', [
  validateJWT,
  check('id', 'Not a valid Mongo ID').isMongoId(),
  check('name', 'The name is mandatory').not().isEmpty(),
  check('id').custom(productExistsById),
  isAdmin,
  validateFields,
], putProduct);

router.delete('/delete/:id', [
  validateJWT,
  check('id', 'Not a valid Mongo ID').isMongoId(),
  check('id').custom(productExistsById),
  check('category').default('640a730fd2ea15582f16ac54'),
  isAdmin,
  validateFields,
], deleteProduct);

export default router;
