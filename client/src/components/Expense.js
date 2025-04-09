// src/components/Expense.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null); // State để theo dõi mục đang chỉnh sửa

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
    } catch (err) {
      setError('Error fetching expenses');
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
    fetchExpenses();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Nếu đang chỉnh sửa, gọi API PUT
        await api.put(`/api/expenses/${editingId}`, { amount, category, date });
        setSuccess('Expense updated successfully');
      } else {
        // Nếu không chỉnh sửa, gọi API POST để thêm mới
        await api.post('/api/expenses', { amount, category, date });
        setSuccess('Expense added successfully');
      }
      fetchExpenses(); // Lấy lại danh sách mới nhất
      setError('');
      setAmount('');
      setCategory('');
      setDate('');
      setEditingId(null); // Reset trạng thái chỉnh sửa
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving expense');
      setSuccess('');
    }
  };

  const handleEdit = (expense) => {
    // Điền thông tin của mục cần chỉnh sửa vào form
    setEditingId(expense._id);
    setAmount(expense.amount);
    setCategory(expense.category._id);
    setDate(new Date(expense.date).toISOString().split('T')[0]); // Định dạng ngày cho input
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/expenses/${id}`);
      fetchExpenses(); // Lấy lại danh sách mới nhất
      setSuccess('Expense deleted successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting expense');
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
      <h2>Expenses</h2>
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
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          {editingId ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
      <div>
        {expenses.map((expense) => (
          <div key={expense._id} style={styles.item}>
            <span>
              {expense.amount} -- {expense.category?.name || 'Unknown Category'} --{' '}
              {new Date(expense.date).toLocaleDateString()}
            </span>
            <button style={styles.editButton} onClick={() => handleEdit(expense)}>
              Edit
            </button>
            <button style={styles.deleteButton} onClick={() => handleDelete(expense._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expense;