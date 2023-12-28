import { Schema, model } from 'mongoose';

const CartSchema = new Schema({
  cart: {
    type: String,
    required: [true, 'The shopping cart is required'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
      default: null,
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

const CartModel = model('Cart', CartSchema);

export default CartModel;
