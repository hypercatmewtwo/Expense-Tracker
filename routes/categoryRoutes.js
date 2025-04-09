const express = require('express');
const router = express.Router();
const categoryService = require('../services/categoryService');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body.name, req.body.description);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    // Tìm category theo ID
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Kiểm tra user có quyền chỉnh sửa category này không
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Kiểm tra xem name có được cung cấp và hợp lệ không
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required and must be a non-empty string' });
    }

    // Cập nhật name
    category.name = name.trim();

    // Lưu thay đổi
    await category.save();

    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    // Kiểm tra lỗi trùng lặp (duplicate key error)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    // Kiểm tra lỗi CastError (ID không hợp lệ)
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;