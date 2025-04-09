const Expense = require('../models/Expense');

const createExpense = async (userId, amount, description, categoryId, date) => {
  const expense = new Expense({ userId, amount, description, categoryId, date });
  await expense.save();
  return expense;
};

const getExpenses = async (userId) => {
  return await Expense.find({ userId }).populate('categoryId');
};

const updateExpense = async (id, updates) => {
  return await Expense.findByIdAndUpdate(id, updates, { new: true });
};

const deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };