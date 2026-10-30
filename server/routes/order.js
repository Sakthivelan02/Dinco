const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Ungaloda Order Mongoose Model path-ai check pannikonga
const { sendOrderEmail } = require('../utils/email'); // Ithuku munbu create panna email.js file

// 1. Create a new Order & Send Confirmation Email
router.post('/', async (req, res) => {
  try {
    const { shipping, totalAmount } = req.body;

    // Cart items-ai user session / database-la irunthu eduthu order create panrom
    // (Ungaloda existing order creation logic eppadi irukko athu padi kooda mathikalam)
    const newOrder = new Order({
      user: req.user ? req.user._id : null, // Auth user iruntha
      shipping,
      total: totalAmount || 0,
      status: 'paid'
    });

    const savedOrder = await newOrder.save();

    // ✉️ Send Email Confirmation to Customer
    if (shipping && shipping.email) {
      await sendOrderEmail(shipping.email, savedOrder);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
});

// 2. Get all orders (Adminku)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Get logged in user's orders
router.get('/mine', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Update order status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;