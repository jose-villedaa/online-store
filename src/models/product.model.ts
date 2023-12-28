import { Schema, model } from 'mongoose';

export const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'The product name is required'],
    unique: true,
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  quantitySold: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

const ProductModel = model('Product', ProductSchema);

export default ProductModel;
