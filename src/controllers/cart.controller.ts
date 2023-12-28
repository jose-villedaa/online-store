import Cart from '@models/cart.model';
import { Request, Response } from 'express';
import Product from '@models/product.model';

const getCart = async (req: Request, res: Response) => {
  const query = { state: true };

  const listCarts = await Promise.all([
    Cart.countDocuments(query),
    Cart.find(query).populate('user', 'name')
      .populate('products'),
  ]);

  res.json({
    msg: 'Get Api - Get Carts',
    listCarts,
  });
};

const postCart = async (req: Request, res: Response) => {
  const cart = req.body.cart.toUpperCase();
  const { products, quantity } = req.body;

  const cartExists = await Cart.exists({ cart });
  if (cartExists) {
    return res.status(400).json({
      msg: `The cart ${cart}, already exists.`,
    });
  }

  const userSearchedProducts = await Promise.all(products.map(
    (productArray) => Product.findById(productArray),
  ));

  const finalTotal = userSearchedProducts.reduce((total, product, index) => {
    const quantities = parseInt(quantity[index], 10);
    return total + product.price * quantities;
  }, 0);

  const data = {
    cart,
    user: req.user.id,
    products: [...req.body.products],
    total: finalTotal,
  };

  const carts = new Cart(data);

  await carts.save();
  return res.status(201).json(carts);
};

const putCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { state, user, ...rest } = req.body;

  rest.cart = rest.cart.toUpperCase();
  rest.products = [...req.body.products];
  rest.user = req.user.id;

  const editedCart = await Cart.findByIdAndUpdate(id, rest, { new: true });

  return res.status(201).json(editedCart);
};

module.exports = {
  getCart,
  postCart,
  putCart,
};
