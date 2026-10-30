import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Product, Order } from './models.js';
import { auth, admin, wrap } from './middleware.js';
import { sendOrderEmail } from '../utils/email.js';

const r = Router();
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin });
const bad = (res, message, code = 400) => res.status(code).json({ message });

// ---- Auth & account ----
r.post('/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return bad(res, 'Name, email and a password of at least 6 characters are required');
  if (await User.findOne({ email: email.toLowerCase() })) return bad(res, 'Email already registered', 409);
  const u = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(u), user: pub(u) });
}));

r.post('/auth/login', wrap(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return bad(res, 'Wrong email or password', 401);
  res.json({ token: sign(u), user: pub(u) });
}));

r.get('/auth/me', auth, (req, res) => res.json(pub(req.user)));

r.put('/auth/me', auth, wrap(async (req, res) => {
  const { name, password } = req.body;
  if (name) req.user.name = name;
  if (password) {
    if (password.length < 6) return bad(res, 'Password must be at least 6 characters');
    req.user.password = await bcrypt.hash(password, 10);
  }
  await req.user.save();
  res.json(pub(req.user));
}));

// ---- Products ----
r.get('/products', wrap(async (req, res) => {
  const { q, category, min, max, sort, featured, page = 1, limit = 12 } = req.query;
  const f = {};
  if (q) f.name = { $regex: String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (category) f.category = category;
  if (featured) f.featured = true;
  if (min || max) f.price = { ...(min && { $gte: +min }), ...(max && { $lte: +max }) };
  const order = { price_asc: { price: 1 }, price_desc: { price: -1 } }[sort] || { createdAt: -1 };
  const [items, total] = await Promise.all([
    Product.find(f).sort(order).skip((+page - 1) * +limit).limit(+limit),
    Product.countDocuments(f),
  ]);
  res.json({ items, total, pages: Math.ceil(total / +limit) });
}));

r.get('/products/categories', wrap(async (_q, res) => res.json(await Product.distinct('category'))));

r.get('/products/:id', wrap(async (req, res) => {
  const p = await Product.findById(req.params.id).catch(() => null);
  p ? res.json(p) : bad(res, 'Product not found', 404);
}));

r.post('/products', auth, admin, wrap(async (req, res) => res.status(201).json(await Product.create(req.body))));

r.put('/products/:id', auth, admin, wrap(async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))));

r.delete('/products/:id', auth, admin, wrap(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

// ---- Cart (stored on the user) ----
const sendCart = async (u, res) => {
  await u.populate('cart.product');
  res.json(u.cart.filter((i) => i.product));
};

r.get('/cart', auth, wrap((req, res) => sendCart(req.user, res)));

r.post('/cart', auth, wrap(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const p = await Product.findById(productId).catch(() => null);
  if (!p) return bad(res, 'Product not found', 404);
  const line = req.user.cart.find((i) => String(i.product) === productId);
  const next = Math.min((line?.qty || 0) + +qty, p.stock);
  if (next < 1) return bad(res, 'Out of stock');
  line ? (line.qty = next) : req.user.cart.push({ product: productId, qty: next });
  await req.user.save();
  sendCart(req.user, res);
}));

r.put('/cart/:productId', auth, wrap(async (req, res) => {
  const line = req.user.cart.find((i) => String(i.product) === req.params.productId);
  const p = await Product.findById(req.params.productId);
  if (line && p) line.qty = Math.max(1, Math.min(+req.body.qty, p.stock));
  await req.user.save();
  sendCart(req.user, res);
}));

r.delete('/cart/:productId', auth, wrap(async (req, res) => {
  req.user.cart = req.user.cart.filter((i) => String(i.product) !== req.params.productId);
  await req.user.save();
  sendCart(req.user, res);
}));

// ---- Orders ----
r.post('/orders', auth, wrap(async (req, res) => {
  const { shipping } = req.body;
  if (!shipping?.fullName || !shipping?.address || !shipping?.city || !shipping?.postalCode || !shipping?.country)
    return bad(res, 'Complete shipping details are required');
  await req.user.populate('cart.product');
  const lines = req.user.cart.filter((i) => i.product);
  if (!lines.length) return bad(res, 'Your cart is empty');
  for (const l of lines)
    if (l.qty > l.product.stock) return bad(res, `Only ${l.product.stock} of "${l.product.name}" left`);
  
  const items = lines.map((l) => ({ product: l.product._id, name: l.product.name, price: l.product.price, qty: l.qty }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const order = await Order.create({ user: req.user._id, items, shipping, total });
  
  await Promise.all(lines.map((l) => Product.updateOne({ _id: l.product._id }, { $inc: { stock: -l.qty } })));
  req.user.cart = [];
  await req.user.save();

  // ✉️ Send Order Confirmation Email using Nodemailer
  try {
    if (shipping.email || req.user.email) {
      await sendOrderEmail(shipping.email || req.user.email, order);
    }
  } catch (emailErr) {
    console.error('Email sending failed:', emailErr);
  }

  res.status(201).json(order);
}));

r.get('/orders/mine', auth, wrap(async (req, res) => res.json(await Order.find({ user: req.user._id }).sort('-createdAt'))));

r.get('/orders', auth, admin, wrap(async (_q, res) => res.json(await Order.find().populate('user', 'name email').sort('-createdAt'))));

r.put('/orders/:id/status', auth, admin, wrap(async (req, res) =>
  res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }))));

export default r;