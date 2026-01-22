import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Incomes from './pages/Incomes';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoals';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/incomes"
            element={
              <PrivateRoute>
                <Layout>
                  <Incomes />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <PrivateRoute>
                <Layout>
                  <Budgets />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/savings-goals"
            element={
              <PrivateRoute>
                <Layout>
                  <SavingsGoals />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <Layout>
                  <Statistics />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
