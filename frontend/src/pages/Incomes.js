import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Transactions.css';

const INCOME_CATEGORIES = ['Salaire', 'Business', 'Autres'];

function Incomes() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Salaire',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/incomes');
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/incomes/${editing.id}`, formData);
      } else {
        await api.post('/incomes', formData);
      }
      fetchIncomes();
      resetForm();
    } catch (error) {
      console.error('Error saving income:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (income) => {
    setEditing(income);
    setFormData({
      amount: income.amount,
      category: income.category,
      date: income.date
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce revenu ?")) {
      try {
        await api.delete(`/incomes/${id}`);
        fetchIncomes();
      } catch (error) {
        console.error('Error deleting income:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: 'Salaire',
      date: new Date().toISOString().split('T')[0]
    });
    setEditing(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const total = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>Revenus</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Ajouter un revenu'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editing ? 'Modifier le revenu' : 'Nouveau revenu'}</h3>
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <label>Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {INCOME_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
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

      <div className="summary-card">
        <h3>Total des revenus</h3>
        <div className="summary-amount positive">{total.toFixed(2)} €</div>
      </div>

      <div className="transactions-list">
        <h3>Liste des revenus</h3>
        {incomes.length === 0 ? (
          <p className="no-data">Aucun revenu enregistré</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map(income => (
                <tr key={income.id}>
                  <td>{new Date(income.date).toLocaleDateString('fr-FR')}</td>
                  <td>{income.category}</td>
                  <td className="amount positive">{income.amount.toFixed(2)} €</td>
                  <td>
                    <button onClick={() => handleEdit(income)} className="btn-edit">✏️</button>
                    <button onClick={() => handleDelete(income.id)} className="btn-delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Incomes;
