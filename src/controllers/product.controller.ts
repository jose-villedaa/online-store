import { Request, Response } from 'express';

import Product from '@models/product.model';

interface RequestWithUser extends Request {
  user: { id: string };
}

const getProducts = async (req: Request, res: Response) => {
  const query = { available: true };

  const productList = await Promise.all([
    Product.countDocuments(query),
    Product.find(query).populate('category', 'name'),
  ]);

  res.json({
    msg: 'List of active products',
    productList,
  });
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productById = await Product.findById(id).populate('category', 'name');

  res.status(201).json(productById);
};

const getBestSellingProducts = async (req: Request, res: Response) => {
  const query = await Product.find().sort({ quantitySold: -1 }).limit(2);

  res.status(201).json({
    message: 'Best selling products in our store!',
    query,
  });
};

const getSoldOutProducts = async (req: Request, res: Response) => {
  const query = { available: false };

  const soldOutProductList = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('category', 'name'),
  ]);

  res.json({
    msg: 'List of out of stock products (Sold Out)',
    soldOutProductList,
  });
};

const postProduct = async (req: RequestWithUser, res: Response) => {
  const { available, user, ...body } = req.body;

  const productDB = await Product.findOne({ name: body.name });

  if (productDB) {
    return res.status(400).json({
      msg: `The product ${productDB.name}, already exists in the DB`,
    });
  }

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user.id,
  };

  const product = new Product(data);

  await product.save();

  return res.status(201).json(product);
};

const putProduct = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { available, user, ...restData } = req.body;

  if (restData.name) {
    restData.name = restData.name.toUpperCase();
    restData.user = req.user.id;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, restData, {
    new: true,
  });

  res.status(201).json({
    msg: 'Put Controller Product',
    updatedProduct,
  });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Product.findByIdAndUpdate(
    id,
    { available: false },
    { new: true },
  );

  res.json({
    msg: 'Product disabled',
  });
};

export {
  getProducts,
  getProductById,
  getBestSellingProducts,
  getSoldOutProducts,
  postProduct,
  putProduct,
  deleteProduct,
};
