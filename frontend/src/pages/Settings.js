import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

function Settings() {
  const { user } = useAuth();

  return (
    <div className="settings-page">
      <h2>Paramètres</h2>
      
      <div className="settings-section">
        <h3>Informations du compte</h3>
        <div className="info-card">
          <div className="info-item">
            <label>Email</label>
            <div className="info-value">{user?.email}</div>
          </div>
          <div className="info-item">
            <label>Nom complet</label>
            <div className="info-value">{user?.full_name || 'Non défini'}</div>
          </div>
          <div className="info-item">
            <label>Date d'inscription</label>
            <div className="info-value">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>À propos</h3>
        <div className="info-card">
          <p>
            Application de gestion des finances personnelles développée avec FastAPI et React.
          </p>
          <p>
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
