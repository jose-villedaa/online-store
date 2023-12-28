import { Router } from 'express';
import { check } from 'express-validator';
import { search, searchProductByCategory } from '@controllers/find.controller';
import validateFields from '@middlewares/validate-fields';

const router = Router();

router.get('/:coleccion/:termino', [
  check('coleccion', 'Collection is required').not().isEmpty(),
  check('termino', 'Term is required').not().isEmpty(),
  validateFields,
], searchProductByCategory);

router.get('/:coleccion/:termino/show', [
  check('coleccion', 'Collection is required').not().isEmpty(),
  check('termino', 'Term is required').not().isEmpty(),
  validateFields,
], search);

export default router;
