import { Response, Request } from 'express';
import Category from '@models/category.model';
import Product from '@models/product.model';
import mongoose from 'mongoose';

const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles',
];

const searchProductByCategory = async (req: Request, res: Response) => {
  const { term } = req.params;
  const isMongoID = mongoose.Types.ObjectId.isValid(term);

  if (isMongoID) {
    const category = await Category.findById(term);
    if (!category) {
      return res.status(404).json({
        msg: 'Category not found',
      });
    }
    const products = await Product.find({ category: category.id });
    return res.json({
      products,
    });
  }

  const regex = new RegExp(term, 'i');

  const categories = await Category.find({
    $or: [{ name: regex }],
    $and: [{ status: true }],
  });

  const products = await Product.find({ category: categories });
  return res.json({
    products,
  });
};

const searchProducts = async (res: Response, term = '') => {
  const isMongoID = mongoose.Types.ObjectId.isValid(term);

  if (isMongoID) {
    const product = await Product.findById(term);
    return res.json({
      results: (product) ? [product] : [],
    });
  }

  const regex = new RegExp(term, 'i');

  const product = await Product.find({
    $or: [{ name: regex }],
    $and: [{ available: true }],
  });

  return res.json({
    results: product,
  });
};

const search = (req: Request, res: Response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The collection: ${collection} does not exist in the DB. The allowed collections are: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case 'categories':
      searchProductByCategory(req, res);
      break;
    case 'products':
      searchProducts(res, term);
      break;
    default:
      res.status(500).json({
        msg: 'Oops, I forgot to do this search...',
      });
      break;
  }
  return true;
};

export {
  search,
  searchProductByCategory,
  searchProducts,
};
