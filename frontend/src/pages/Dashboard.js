import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await api.get('/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'finances_export.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await api.get('/export/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'finances_export.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }

  if (!stats) {
    return <div className="error">Erreur lors du chargement des données</div>;
  }

  const categoryData = {
    labels: stats.category_stats.map(c => c.category),
    datasets: [{
      data: stats.category_stats.map(c => c.amount),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ]
    }]
  };

  const evolutionData = {
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
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#27ae60';
      case 'bon': return '#3498db';
      case 'moyen': return '#f39c12';
      case 'critique': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getHealthStatusText = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'bon': return 'Bon';
      case 'moyen': return 'Moyen';
      case 'critique': return 'Critique';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de bord</h2>
        <div className="export-buttons">
          <button onClick={exportCSV} className="btn-export">📥 Export CSV</button>
          <button onClick={exportExcel} className="btn-export">📊 Export Excel</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-label">Solde actuel</div>
          <div className="stat-value">{stats.balance.toFixed(2)} €</div>
        </div>
        <div className="stat-card income">
          <div className="stat-label">Revenus totaux</div>
          <div className="stat-value">{stats.total_income.toFixed(2)} €</div>
        </div>
        <div className="stat-card expense">
          <div className="stat-label">Dépenses totales</div>
          <div className="stat-value">{stats.total_expenses.toFixed(2)} €</div>
        </div>
        <div className="stat-card monthly">
          <div className="stat-label">Revenus du mois</div>
          <div className="stat-value">{stats.monthly_income.toFixed(2)} €</div>
        </div>
        <div className="stat-card monthly">
          <div className="stat-label">Dépenses du mois</div>
          <div className="stat-value">{stats.monthly_expenses.toFixed(2)} €</div>
        </div>
        <div className="stat-card health" style={{ borderColor: getHealthStatusColor(stats.health_status) }}>
          <div className="stat-label">Santé financière</div>
          <div className="stat-value" style={{ color: getHealthStatusColor(stats.health_status) }}>
            {getHealthStatusText(stats.health_status)}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Dépenses par catégorie</h3>
          {stats.category_stats.length > 0 ? (
            <Doughnut data={categoryData} />
          ) : (
            <p className="no-data">Aucune dépense enregistrée</p>
          )}
        </div>
        <div className="chart-card">
          <h3>Évolution mensuelle</h3>
          <Line data={evolutionData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
