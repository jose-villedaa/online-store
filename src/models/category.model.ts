import { Schema, model } from 'mongoose';

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'The name of the category is mandatory'],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const CategoryModel = model('Category', CategorySchema);

export default CategoryModel;
