import Invoice from '@models/invoice.model';
import { Request, Response } from 'express';

const getInvoices = async (req: Request, res: Response) => {
  const query = { status: true };

  const invoiceList = await Promise.all([
    Invoice.countDocuments(query),
    Invoice.find(query).populate('user', 'email').populate('cart'),
  ]);

  res.json({
    msg: 'get Api - User Controller',
    invoiceList,
  });
};

const getInvoiceByClient = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const query = { status: true, user: userId };

  const invoiceList = await Promise.all([
    Invoice.countDocuments(query),
    Invoice.find(query).populate('user', 'name').populate('cart'),
  ]);

  res.json({
    msg: 'These are my purchases',
    invoiceList,
  });
};

const postInvoice = async (req: Request, res: Response) => {
  const { user, ...body } = req.body;

  const date = Date.now();

  const data = {
    ...body,
    date,
    user: req.user.id,
  };

  const invoice = new Invoice(data);

  await invoice.save();

  res.status(201).json(invoice);
};

export { getInvoices, getInvoiceByClient, postInvoice };
