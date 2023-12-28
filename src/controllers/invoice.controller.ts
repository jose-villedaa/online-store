import Invoice from '@models/invoice.model';
import { Request, Response } from 'express';

const getFacturas = async (req: Request, res: Response) => {
  const query = { estado: true };

  const listaFactura = await Promise.all([
    Invoice.countDocuments(query),
    Invoice.find(query).populate('user', 'email').populate('cart'),
  ]);

  res.json({
    msg: 'get Api - Controlador Usuario',
    listaFactura,
  });
};

const getFacturaXCliente = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const query = { estado: true, user: userId };

  const listaFacturas = await Promise.all([
    Invoice.countDocuments(query),
    Invoice.find(query).populate('usuario', 'nombre').populate('carrito'),
  ]);

  res.json({
    msg: 'Mis compras son estas',
    listaFacturas,
  });
};

const postFactura = async (req: Request, res: Response) => {
  const { user, ...body } = req.body;

  const date = Date.now();

  const data = {
    ...body,
    date,
    user: req.user.id,
  };

  const factura = new Invoice(data);

  await factura.save();

  res.status(201).json(factura);
};

module.exports = {
  getFacturas,
  postFactura,
  getFacturaXCliente,
};
