import Product from '@models/product.model';
import Rol from '@models/rol.model';
import User from '@models/user.model';
import Category from '@models/category.model';

const isValidRol = async (rol = '') => {
  const existingRol = await Rol.findOne({ rol });

  if (!existingRol) {
    throw new Error(`The role ${rol} is not registered in the DB`);
  }
};

const emailExists = async (email = '') => {
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new Error(`The email: ${email} already exists and is registered in the DB`);
  }
};

const userExistsById = async (id: string) => {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new Error(`The id ${id} does not exist in the DB`);
  }
};

const categoryExistsById = async (id: string) => {
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    throw new Error(`The id ${id} does not exist in the DB`);
  }
};

const productExistsById = async (id: string) => {
  const existingProduct = await Product.findById(id);

  if (!existingProduct) {
    throw new Error(`The id ${id} does not exist in the DB`);
  }
};

export {
  isValidRol,
  emailExists,
  userExistsById,
  categoryExistsById,
  productExistsById,
};
