import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>Expense Tracker</div>
      {user ? (
        <div style={styles.navLinks}>
          <Link to="/categories" style={styles.link}>Categories</Link>
          <Link to="/expenses" style={styles.link}>Expenses</Link>
          <Link to="/budgets" style={styles.link}>Budgets</Link>
          <Link to="/incomes" style={styles.link}>Incomes</Link>
          {user.avatar ? (
            <img
              src={`http://localhost:5000/${user.avatar}`}
              alt="Avatar"
              style={styles.avatar}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40'; // Hình ảnh mặc định nếu avatar không tải được
              }}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>No Avatar</div>
          )}
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: '10px 20px',
    color: '#fff',
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;