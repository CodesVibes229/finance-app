import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Budgets.css';

const BUDGET_CATEGORIES = [
  'Logement', 'Nourriture', 'Transport', 'Loisirs',
  'Santé', 'Éducation', 'Shopping', 'Autres'
];

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Logement',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/budgets/${editing.id}`, formData);
      } else {
        await api.post('/budgets', formData);
      }
      fetchBudgets();
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (budget) => {
    setEditing(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      year: budget.year
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'Logement',
      amount: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
    setEditing(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentBudgets = budgets.filter(
    b => b.month === currentMonth && b.year === currentYear
  );

  return (
    <div className="budgets-page">
      <div className="page-header">
        <h2>Budgets</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Ajouter un budget'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editing ? 'Modifier le budget' : 'Nouveau budget'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {BUDGET_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Montant (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mois</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1).toLocaleString('fr-FR', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Année</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                  min="2020"
                  max="2100"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editing ? 'Modifier' : 'Ajouter'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="budgets-list">
        <h3>Budgets du mois en cours</h3>
        {currentBudgets.length === 0 ? (
          <p className="no-data">Aucun budget défini pour ce mois</p>
        ) : (
          <div className="budgets-grid">
            {currentBudgets.map(budget => (
              <div key={budget.id} className="budget-card">
                <div className="budget-header">
                  <h4>{budget.category}</h4>
                  <div className="budget-actions">
                    <button onClick={() => handleEdit(budget)} className="btn-edit">✏️</button>
                    <button onClick={() => handleDelete(budget.id)} className="btn-delete">🗑️</button>
                  </div>
                </div>
                <div className="budget-amount">{budget.amount.toFixed(2)} €</div>
                <div className="budget-period">
                  {new Date(2000, budget.month - 1).toLocaleString('fr-FR', { month: 'long' })} {budget.year}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Budgets;
