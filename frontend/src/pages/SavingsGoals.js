import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './SavingsGoals.css';

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '0',
    target_date: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/savings-goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount),
        target_date: formData.target_date || null
      };
      
      if (editing) {
        await api.put(`/savings-goals/${editing.id}`, data);
      } else {
        await api.post('/savings-goals', data);
      }
      fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (goal) => {
    setEditing(goal);
    setFormData({
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      target_date: goal.target_date || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      try {
        await api.delete(`/savings-goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      target_amount: '',
      current_amount: '0',
      target_date: ''
    });
    setEditing(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="savings-goals-page">
      <div className="page-header">
        <h2>Objectifs d'épargne</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Ajouter un objectif'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editing ? 'Modifier l\'objectif' : 'Nouvel objectif'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom de l'objectif</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Vacances, Achat voiture..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Montant cible (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Montant actuel (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.current_amount}
                  onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Date cible (optionnel)</label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
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

      <div className="goals-list">
        {goals.length === 0 ? (
          <p className="no-data">Aucun objectif d'épargne défini</p>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h4>{goal.name}</h4>
                    <div className="goal-actions">
                      <button onClick={() => handleEdit(goal)} className="btn-edit">✏️</button>
                      <button onClick={() => handleDelete(goal.id)} className="btn-delete">🗑️</button>
                    </div>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      {progress.toFixed(1)}% ({goal.current_amount.toFixed(2)} € / {goal.target_amount.toFixed(2)} €)
                    </div>
                  </div>
                  {goal.target_date && (
                    <div className="goal-date">
                      Date cible: {new Date(goal.target_date).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavingsGoals;
