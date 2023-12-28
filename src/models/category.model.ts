import { Schema, model } from 'mongoose';

const CategoriaSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la cateogira es obligatorio'],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
  },
});

const CategoryModel = model('Category', CategoriaSchema);

export default CategoryModel;
