// src/components/Budget.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null); // State để theo dõi mục đang chỉnh sửa

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/api/budgets');
      setBudgets(response.data);
    } catch (err) {
      setError('Error fetching budgets');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Nếu đang chỉnh sửa, gọi API PUT
        await api.put(`/api/budgets/${editingId}`, { amount, category });
        setSuccess('Budget updated successfully');
      } else {
        // Nếu không chỉnh sửa, gọi API POST để thêm mới
        await api.post('/api/budgets', { amount, category });
        setSuccess('Budget added successfully');
      }
      fetchBudgets(); // Lấy lại danh sách mới nhất
      setError('');
      setAmount('');
      setCategory('');
      setEditingId(null); // Reset trạng thái chỉnh sửa
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving budget');
      setSuccess('');
    }
  };

  const handleEdit = (budget) => {
    // Điền thông tin của mục cần chỉnh sửa vào form
    setEditingId(budget._id);
    setAmount(budget.amount);
    setCategory(budget.category._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/budgets/${id}`);
      fetchBudgets(); // Lấy lại danh sách mới nhất
      setSuccess('Budget deleted successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting budget');
      setSuccess('');
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '8px',
      margin: '8px 0',
      boxSizing: 'border-box',
    },
    button: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '100%',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '5px',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Budgets</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" style={styles.button}>
          {editingId ? 'Update Budget' : 'Add Budget'}
        </button>
      </form>
      <div>
        {budgets.map((budget) => (
          <div key={budget._id} style={styles.item}>
            <span>
              {budget.amount} -- {budget.category?.name || 'Unknown Category'}
            </span>
            <button style={styles.editButton} onClick={() => handleEdit(budget)}>
              Edit
            </button>
            <button style={styles.deleteButton} onClick={() => handleDelete(budget._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budget;