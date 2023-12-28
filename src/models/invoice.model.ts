import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The invoice name is required'],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    required: [true, 'The date is required'],
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

const InvoiceModel = model('Invoice', InvoiceSchema);

export default InvoiceModel;
