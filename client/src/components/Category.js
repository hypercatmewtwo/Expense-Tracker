import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null); // State để lưu ID của danh mục đang chỉnh sửa
  const [editName, setEditName] = useState(''); // State để lưu tên danh mục đang chỉnh sửa

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/categories', { name });
      setCategories([...categories, response.data]);
      setSuccess('Category added successfully');
      setError('');
      setName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding category');
      setSuccess('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      setSuccess('Category deleted successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting category');
      setSuccess('');
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setEditName(category.name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/categories/${editId}`, { name: editName });
      setCategories(categories.map((cat) => (cat._id === editId ? response.data : cat)));
      setSuccess('Category updated successfully');
      setError('');
      setEditId(null);
      setEditName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating category');
      setSuccess('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Categories</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      {/* Form thêm danh mục */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Add Category</button>
      </form>
      {/* Form chỉnh sửa danh mục */}
      {editId && (
        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Edit Category Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter new category name"
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Update Category</button>
          <button
            type="button"
            onClick={() => setEditId(null)}
            style={{ ...styles.button, backgroundColor: '#dc3545', marginLeft: '10px' }}
          >
            Cancel
          </button>
        </form>
      )}
      <ul style={styles.list}>
        {categories.map((category) => (
          <li key={category._id} style={styles.listItem}>
            {category.name}
            <div>
              <button onClick={() => handleEdit(category)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(category._id)} style={styles.deleteButton}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    textAlign: 'center',
  },
};

export default Category;