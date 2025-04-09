const Income = require('../models/Income');

const createIncome = async (userId, amount, description, date) => {
  const income = new Income({ userId, amount, description, date });
  await income.save();
  return income;
};

const getIncomes = async (userId) => {
  return await Income.find({ userId });
};

const updateIncome = async (id, updates) => {
  return await Income.findByIdAndUpdate(id, updates, { new: true });
};

const deleteIncome = async (id) => {
  return await Income.findByIdAndDelete(id);
};

module.exports = { createIncome, getIncomes, updateIncome, deleteIncome };