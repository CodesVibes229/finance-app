import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Transactions.css';

const EXPENSE_CATEGORIES = [
  'Logement', 'Nourriture', 'Transport', 'Loisirs',
  'Santé', 'Éducation', 'Shopping', 'Autres'
];

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Logement',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/expenses/${editing.id}`, formData);
      } else {
        await api.post('/expenses', formData);
      }
      fetchExpenses();
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (expense) => {
    setEditing(expense);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      comment: expense.comment || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: 'Logement',
      date: new Date().toISOString().split('T')[0],
      comment: ''
    });
    setEditing(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>Dépenses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Ajouter une dépense'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editing ? 'Modifier la dépense' : 'Nouvelle dépense'}</h3>
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
                {EXPENSE_CATEGORIES.map(cat => (
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
            <div className="form-group">
              <label>Commentaire (optionnel)</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows="3"
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
        <h3>Total des dépenses</h3>
        <div className="summary-amount negative">{total.toFixed(2)} €</div>
      </div>

      <div className="transactions-list">
        <h3>Liste des dépenses</h3>
        {expenses.length === 0 ? (
          <p className="no-data">Aucune dépense enregistrée</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Commentaire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{new Date(expense.date).toLocaleDateString('fr-FR')}</td>
                  <td>{expense.category}</td>
                  <td className="amount negative">{expense.amount.toFixed(2)} €</td>
                  <td>{expense.comment || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(expense)} className="btn-edit">✏️</button>
                    <button onClick={() => handleDelete(expense.id)} className="btn-delete">🗑️</button>
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

export default Expenses;
