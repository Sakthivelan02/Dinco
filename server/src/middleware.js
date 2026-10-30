import jwt from 'jsonwebtoken';
import { User } from './models.js';

/** Wraps async handlers so errors reach the error middleware. */
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Requires a valid Bearer JWT; attaches the user to req.user. */
export const auth = wrap(async (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ message: 'Please log in to continue' });
  }
});

/** Must run after auth. */
export const admin = (req, res, next) =>
  req.user?.isAdmin ? next() : res.status(403).json({ message: 'Admin access required' });
