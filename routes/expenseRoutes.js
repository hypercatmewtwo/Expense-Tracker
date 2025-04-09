// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// GET /api/expenses
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).populate('category');
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// POST /api/expenses
router.post('/', auth, async (req, res) => {
  const { amount, category, date } = req.body;
  try {
    const expense = new Expense({
      amount,
      category,
      date,
      user: req.user.id,
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(400).json({ message: err.message || 'Error adding expense' });
  }
});

// PUT /api/expenses/:id
router.put('/:id', auth, async (req, res) => {
  const { amount, category, date } = req.body;
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    expense.amount = amount;
    expense.category = category;
    expense.date = date;
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(400).json({ message: err.message || 'Error updating expense' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting expense with ID:', req.params.id); // Thêm log
    console.log('User ID from token:', req.user.id); // Thêm log
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    console.log('Expense user ID:', expense.user.toString()); // Thêm log
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await expense.deleteOne(); // Sử dụng deleteOne() thay vì remove()
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

module.exports = router;