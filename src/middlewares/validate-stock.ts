import { Request, Response, NextFunction } from 'express';

const Product = require('../models/product.model');

const validateProductAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { products, quantity } = req.body;

  const productsDB = await Promise.all(products.map(
    (product: string) => Product.findById(product),
  ));

  productsDB.forEach((searchedProductDB, i) => {
    const productQuantity = quantity[i];

    if (searchedProductDB) {
      if (searchedProductDB.available === false) {
        return res.status(400).json({
          msg: 'Sorry, the product is not available :(',
        });
      }

      if (productQuantity > searchedProductDB.quantity) {
        return res.status(405).json({
          msg: 'Sorry, the product is out of stock :(',
        });
      }
    }
    return res.status(400).json({
      msg: 'Product not found',
    });
  }, productsDB);

  return next();
};

export default validateProductAvailability;
