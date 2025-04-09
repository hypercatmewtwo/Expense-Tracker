// routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// GET /api/budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).populate('category');
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).json({ message: 'Error fetching budgets' });
  }
});

// POST /api/budgets
router.post('/', auth, async (req, res) => {
  const { amount, category } = req.body;
  try {
    const budget = new Budget({
      amount,
      category,
      user: req.user.id,
    });
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error('Error adding budget:', err);
    res.status(400).json({ message: err.message || 'Error adding budget' });
  }
});

// PUT /api/budgets/:id
router.put('/:id', auth, async (req, res) => {
  const { amount, category } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    budget.amount = amount;
    budget.category = category;
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(400).json({ message: err.message || 'Error updating budget' });
  }
});

// DELETE /api/budgets/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting budget with ID:', req.params.id); // Thêm log
    console.log('User ID from token:', req.user.id); // Thêm log
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    console.log('Budget user ID:', budget.user.toString()); // Thêm log
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await budget.deleteOne(); // Sử dụng deleteOne() thay vì remove()
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(500).json({ message: 'Error deleting budget' });
  }
});

module.exports = router;