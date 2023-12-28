import { Router } from 'express';
import { check } from 'express-validator';
import validateFields from '@middlewares/validate-fields';
import validateJWT from '@middlewares/validate-jwt';
import validateRols from '@middlewares/validate-rols';
import { categoryExistsById } from '@helpers/db-validators';

import {
  deleteCategory,
  getCategory,
  postCategory,
  listCategories,
  putCategory,
} from '@controllers/category.controller';

const router = Router();

const { isAdmin } = validateRols;

router.get('/', listCategories);

router.get('/:id', [
  check('id', 'Not a valid Mongo ID').isMongoId(),
  check('id').custom(categoryExistsById),
  validateFields,
], getCategory);

router.post('/add', [
  validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  validateFields,
  isAdmin,
], postCategory);

router.put('/edit/:id', [
  validateJWT,
  check('id', 'Not a valid Mongo ID').isMongoId(),
  check('name', 'Name is required').not().isEmpty(),
  check('id').custom(categoryExistsById),
  validateFields,
  isAdmin,
], putCategory);

router.delete('/delete/:id', [
  validateJWT,
  check('id', 'Not a valid Mongo ID').isMongoId(),
  check('id').custom(categoryExistsById),
  validateFields,
  isAdmin,
], deleteCategory);

export default router;
