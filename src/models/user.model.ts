import { Schema, model } from 'mongoose';

export const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
  },
  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
  },
  img: {
    type: String,
    default: null,
  },
  rol: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  transactions: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
  },
});

const UserModel = model('User', UserSchema);

export default UserModel;
