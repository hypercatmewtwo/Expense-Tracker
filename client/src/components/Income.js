// src/components/Income.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/api/incomes');
      setIncomes(response.data);
    } catch (err) {
      setError('Error fetching incomes');
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
    fetchIncomes();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/incomes/${editingId}`, { amount, source, date, category });
        setSuccess('Income updated successfully');
      } else {
        await api.post('/api/incomes', { amount, source, date, category });
        setSuccess('Income added successfully');
      }
      fetchIncomes();
      setError('');
      setAmount('');
      setSource('');
      setDate('');
      setCategory('');
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving income');
      setSuccess('');
    }
  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setAmount(income.amount);
    setSource(income.source);
    setDate(new Date(income.date).toISOString().split('T')[0]);
    setCategory(income.category?._id || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/incomes/${id}`);
        fetchIncomes();
        setSuccess('Income deleted successfully');
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting income');
        setSuccess('');
      }
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
      <h2>Incomes</h2>
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
          <label>Source (e.g., Salary, Freelance, Investment)</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter the source of income"
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
          {editingId ? 'Update Income' : 'Add Income'}
        </button>
      </form>
      <div>
        {incomes.map((income) => (
          <div key={income._id} style={styles.item}>
            <span>
              {income.amount} -- {income.source || 'No Source'} --{' '}
              {income.category?.name || 'No Category'} --{' '}
              {new Date(income.date).toLocaleDateString()}
            </span>
            <button style={styles.editButton} onClick={() => handleEdit(income)}>
              Edit
            </button>
            <button style={styles.deleteButton} onClick={() => handleDelete(income._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Income;