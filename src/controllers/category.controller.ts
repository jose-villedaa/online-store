import Category from '@models/category.model';
import Product from '@models/product.model';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

const listCategories = async (req: Request, res: Response) => {
  const query = { state: true };

  const categoryList = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).populate('user', 'name'),
  ]);

  res.json({
    msg: 'get API - list categories',
    categoryList,
  });
};

const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryById = await Category.findById(id).populate(
    'user',
    'name',
  );

  res.status(201).json(categoryById);
};

const postCategory = async (req: RequestWithUser, res: Response) => {
  const name = req.body.nombre.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `The category ${categoryDB.name}, already exists`,
    });
  }

  const data = {
    name,
    user: req.user.id,
  };

  const category = new Category(data);
  await category.save();

  return res.status(201).json(category);
};

const putCategory = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { state, user, ...rest } = req.body;

  rest.name = rest.name.toUpperCase();
  rest.user = req.user.id;

  const editedCategory = await Category.findByIdAndUpdate(id, rest, {
    new: true,
  });

  res.status(201).json(editedCategory);
};

const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const defaultCategoryName = 'default category';
  const defaultCategory = await Category.findOne({ name: defaultCategoryName });

  if (!defaultCategory) {
    return res.status(500).json({
      msg: 'The default category does not exist.',
    });
  }

  await Product.updateMany(
    { category: id },
    { category: defaultCategory.id },
  );

  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true },
  );

  return res.status(201).json(deletedCategory);
};

export {
  listCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
};
