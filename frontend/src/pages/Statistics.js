import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [stats, setStats] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    try {
      const [statsRes, incomesRes, expensesRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/incomes'),
        api.get('/expenses')
      ]);
      setStats(statsRes.data);
      setIncomes(incomesRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  // Données annuelles
  const yearlyData = {};
  const currentYear = selectedYear;

  incomes.forEach(income => {
    const year = new Date(income.date).getFullYear();
    if (year === currentYear) {
      const month = new Date(income.date).getMonth();
      if (!yearlyData[month]) {
        yearlyData[month] = { income: 0, expenses: 0 };
      }
      yearlyData[month].income += income.amount;
    }
  });

  expenses.forEach(expense => {
    const year = new Date(expense.date).getFullYear();
    if (year === currentYear) {
      const month = new Date(expense.date).getMonth();
      if (!yearlyData[month]) {
        yearlyData[month] = { income: 0, expenses: 0 };
      }
      yearlyData[month].expenses += expense.amount;
    }
  });

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthlyIncome = months.map((_, i) => yearlyData[i]?.income || 0);
  const monthlyExpenses = months.map((_, i) => yearlyData[i]?.expenses || 0);

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Revenus',
        data: monthlyIncome,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Dépenses',
        data: monthlyExpenses,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  // Dépenses par catégorie (année complète)
  const categoryExpenses = {};
  expenses.forEach(expense => {
    const year = new Date(expense.date).getFullYear();
    if (year === currentYear) {
      categoryExpenses[expense.category] = (categoryExpenses[expense.category] || 0) + expense.amount;
    }
  });

  const categoryData = {
    labels: Object.keys(categoryExpenses),
    datasets: [{
      data: Object.values(categoryExpenses),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ]
    }]
  };

  // Revenus par catégorie
  const categoryIncomes = {};
  incomes.forEach(income => {
    const year = new Date(income.date).getFullYear();
    if (year === currentYear) {
      categoryIncomes[income.category] = (categoryIncomes[income.category] || 0) + income.amount;
    }
  });

  const incomeCategoryData = {
    labels: Object.keys(categoryIncomes),
    datasets: [{
      data: Object.values(categoryIncomes),
      backgroundColor: [
        '#27ae60', '#2ecc71', '#3498db', '#9b59b6'
      ]
    }]
  };

  const totalIncome = monthlyIncome.reduce((a, b) => a + b, 0);
  const totalExpenses = monthlyExpenses.reduce((a, b) => a + b, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome * 100) : 0;

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h2>Statistiques</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="year-select"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <div className="summary-label">Revenus totaux</div>
          <div className="summary-value positive">{totalIncome.toFixed(2)} €</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Dépenses totales</div>
          <div className="summary-value negative">{totalExpenses.toFixed(2)} €</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Épargne</div>
          <div className="summary-value" style={{ color: savings >= 0 ? '#27ae60' : '#e74c3c' }}>
            {savings.toFixed(2)} €
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Taux d'épargne</div>
          <div className="summary-value" style={{ color: savingsRate >= 20 ? '#27ae60' : savingsRate >= 10 ? '#3498db' : '#f39c12' }}>
            {savingsRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenus vs Dépenses ({selectedYear})</h3>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart-card">
          <h3>Dépenses par catégorie</h3>
          {Object.keys(categoryExpenses).length > 0 ? (
            <Doughnut data={categoryData} />
          ) : (
            <p className="no-data">Aucune donnée</p>
          )}
        </div>
        <div className="chart-card">
          <h3>Revenus par catégorie</h3>
          {Object.keys(categoryIncomes).length > 0 ? (
            <Doughnut data={incomeCategoryData} />
          ) : (
            <p className="no-data">Aucune donnée</p>
          )}
        </div>
        {stats && (
          <div className="chart-card">
            <h3>Évolution sur 6 mois</h3>
            <Line data={stats.monthly_evolution ? {
              labels: stats.monthly_evolution.map(e => e.month),
              datasets: [
                {
                  label: 'Revenus',
                  data: stats.monthly_evolution.map(e => e.income),
                  borderColor: '#36A2EB',
                  backgroundColor: 'rgba(54, 162, 235, 0.1)',
                  tension: 0.4
                },
                {
                  label: 'Dépenses',
                  data: stats.monthly_evolution.map(e => e.expenses),
                  borderColor: '#FF6384',
                  backgroundColor: 'rgba(255, 99, 132, 0.1)',
                  tension: 0.4
                }
              ]
            } : { labels: [], datasets: [] }} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
