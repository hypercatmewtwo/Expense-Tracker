// routes/incomeRoutes.js
const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');

// GET /api/incomes
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).populate('category');
    res.json(incomes);
  } catch (err) {
    console.error('Error fetching incomes:', err);
    res.status(500).json({ message: 'Error fetching incomes' });
  }
});

// POST /api/incomes
router.post('/', auth, async (req, res) => {
  const { amount, source, date, category } = req.body;
  try {
    const income = new Income({
      amount,
      source,
      date,
      category,
      user: req.user.id,
    });
    await income.save();
    res.json(income);
  } catch (err) {
    console.error('Error adding income:', err);
    res.status(400).json({ message: err.message || 'Error adding income' });
  }
});

// PUT /api/incomes/:id
router.put('/:id', auth, async (req, res) => {
  const { amount, source, date, category } = req.body;
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    income.amount = amount;
    income.source = source;
    income.date = date;
    income.category = category;
    await income.save();
    res.json(income);
  } catch (err) {
    console.error('Error updating income:', err);
    res.status(400).json({ message: err.message || 'Error updating income' });
  }
});

// DELETE /api/incomes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await income.deleteOne();
    res.json({ message: 'Income deleted' });
  } catch (err) {
    console.error('Error deleting income:', err);
    res.status(500).json({ message: 'Error deleting income' });
  }
});

module.exports = router;