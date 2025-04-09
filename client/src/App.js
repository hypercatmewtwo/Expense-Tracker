import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Category from './components/Category';
import Expense from './components/Expense';
import Budget from './components/Budget';
import Income from './components/Income';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/expenses" element={<Expense />} />
          <Route path="/budgets" element={<Budget />} />
          <Route path="/incomes" element={<Income />} />
          <Route path="/" element={<Category />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;