const Category = require('../models/Category');

const createCategory = async (name, description) => {
  const category = new Category({ name, description });
  await category.save();
  return category;
};

const getCategories = async () => {
  return await Category.find();
};

const updateCategory = async (id, updates) => {
  return await Category.findByIdAndUpdate(id, updates, { new: true });
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };