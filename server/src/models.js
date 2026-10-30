import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const id = { type: Schema.Types.ObjectId, ref: 'Product' };

export const User = model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  cart: [{ product: id, qty: { type: Number, min: 1, default: 1 }, _id: false }],
}, { timestamps: true }));

export const Product = model('Product', new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'General', index: true },
  image: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true }));

export const Order = model('Order', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: id, name: String, price: Number, qty: Number, _id: false }],
  shipping: { fullName: String, address: String, city: String, postalCode: String, country: String },
  paymentMethod: { type: String, default: 'Card (demo)' },
  total: Number,
  status: { type: String, enum: ['paid', 'shipped', 'delivered'], default: 'paid' },
}, { timestamps: true }));
