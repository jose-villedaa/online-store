import { Schema, model } from 'mongoose';

const RolSchema: Schema = new Schema({
  rol: {
    type: String,
    required: [true, 'The rol is required'],
  },
});

const RolModel = model('Rol', RolSchema);

export default RolModel;
