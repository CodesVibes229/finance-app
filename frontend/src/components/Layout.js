import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: '📊' },
    { path: '/incomes', label: 'Revenus', icon: '💰' },
    { path: '/expenses', label: 'Dépenses', icon: '💸' },
    { path: '/budgets', label: 'Budgets', icon: '📋' },
    { path: '/savings-goals', label: 'Épargne', icon: '🎯' },
    { path: '/statistics', label: 'Statistiques', icon: '📈' },
    { path: '/settings', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div className="layout">
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>💰 Finances</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="user-info">
            <span>{user?.full_name || user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </nav>
      
      <div className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1>{menuItems.find(item => item.path === location.pathname)?.label || 'Finances'}</h1>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
