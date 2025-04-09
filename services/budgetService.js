const Budget = require('../models/Budget');

const createBudget = async (userId, categoryId, amount, startDate, endDate) => {
  const budget = new Budget({ userId, categoryId, amount, startDate, endDate });
  await budget.save();
  return budget;
};

const getBudgets = async (userId) => {
  return await Budget.find({ userId }).populate('categoryId');
};

const updateBudget = async (id, updates) => {
  return await Budget.findByIdAndUpdate(id, updates, { new: true });
};

const deleteBudget = async (id) => {
  return await Budget.findByIdAndDelete(id);
};

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget };