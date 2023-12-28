import { Router } from 'express';
import validateFields from '@middlewares/validate-fields';
import validateJWT from '@middlewares/validate-jwt';
import validateRols from '@middlewares/validate-rols';
import { getInvoices, getInvoiceByClient, postInvoice } from '@controllers/invoice.controller';

const router = Router();

const { isAdmin } = validateRols;

router.get('/show', [
  validateJWT,
  isAdmin,
], getInvoices);

router.get('/showInvoices', [
  validateJWT,
  validateFields,
], getInvoiceByClient);

router.post('/add', [
  validateJWT,
  validateFields,
], postInvoice);

export default router;
