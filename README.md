# 💰 Application Web de Gestion des Finances Personnelles

Application web complète pour la gestion personnelle des finances avec suivi des revenus, dépenses, budgets et statistiques.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Documentation](#-documentation)

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- ✅ Création de compte utilisateur
- ✅ Connexion / déconnexion sécurisée
- ✅ Mots de passe hashés (bcrypt)
- ✅ Sessions sécurisées (JWT)
- ✅ Données strictement privées par utilisateur

### 💰 Gestion des Revenus
- ✅ Ajouter, modifier, supprimer des revenus
- ✅ Catégorisation (Salaire, Business, Autres)
- ✅ Enregistrement avec date et montant

### 💸 Gestion des Dépenses
- ✅ Ajouter, modifier, supprimer des dépenses
- ✅ Catégories multiples (Logement, Nourriture, Transport, Loisirs, Santé, etc.)
- ✅ Commentaire optionnel pour chaque dépense

### 📊 Tableau de Bord
- ✅ Solde actuel
- ✅ Totaux revenus / dépenses
- ✅ Revenus et dépenses du mois en cours
- ✅ Dépenses par catégorie (graphique camembert)
- ✅ Évolution mensuelle sur 6 mois (graphique linéaire)
- ✅ Indicateur de santé financière

### 📋 Gestion de Budget
- ✅ Définir un budget mensuel par catégorie
- ✅ Suivi des budgets du mois en cours

### 🎯 Objectifs d'épargne
- ✅ Créer des objectifs d'épargne
- ✅ Suivi de la progression avec barre de progression
- ✅ Date cible optionnelle

### 📈 Statistiques
- ✅ Graphiques comparatifs revenus/dépenses
- ✅ Analyse par catégorie (revenus et dépenses)
- ✅ Évolution annuelle
- ✅ Calcul du taux d'épargne

### 📥 Export de données
- ✅ Export CSV
- ✅ Export Excel (.xlsx)

## 🛠️ Technologies

### Backend
- **FastAPI** - Framework web moderne et rapide
- **SQLite** - Base de données (facilement migrable vers PostgreSQL)
- **SQLAlchemy** - ORM pour la gestion de la base de données
- **JWT** - Authentification sécurisée
- **Pydantic** - Validation des données
- **Bcrypt** - Hashage des mots de passe

### Frontend
- **React 18** - Bibliothèque JavaScript pour l'interface
- **React Router** - Navigation entre les pages
- **Chart.js** - Graphiques et visualisations
- **Axios** - Client HTTP pour les appels API
- **CSS moderne** - Design responsive et élégant

## 🚀 Installation

### Prérequis

- **Python 3.8+** pour le backend
- **Node.js 16+** et **npm** pour le frontend

### Backend

1. Naviguer vers le dossier backend :
```bash
cd finance-app/backend
```

2. Créer un environnement virtuel (recommandé) :
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Installer les dépendances :
```bash
pip install -r requirements.txt
```

4. Lancer le serveur :
```bash
uvicorn main:app --reload
```

Le serveur API sera accessible sur `http://localhost:8000`
La documentation API sera disponible sur `http://localhost:8000/docs`

### Frontend

1. Naviguer vers le dossier frontend :
```bash
cd finance-app/frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📖 Utilisation

### Première utilisation

1. **Créer un compte** :
   - Accéder à `http://localhost:3000`
   - Cliquer sur "S'inscrire"
   - Remplir le formulaire (email, mot de passe, nom optionnel)

2. **Se connecter** :
   - Utiliser vos identifiants pour vous connecter

3. **Commencer à utiliser** :
   - Ajouter vos premiers revenus et dépenses
   - Définir des budgets mensuels
   - Créer des objectifs d'épargne
   - Consulter les statistiques

### Navigation

L'application dispose d'un menu latéral avec :
- 📊 **Tableau de bord** - Vue d'ensemble
- 💰 **Revenus** - Gestion des revenus
- 💸 **Dépenses** - Gestion des dépenses
- 📋 **Budgets** - Gestion des budgets
- 🎯 **Épargne** - Objectifs d'épargne
- 📈 **Statistiques** - Analyses détaillées
- ⚙️ **Paramètres** - Informations du compte

## 📁 Structure du projet

```
finance-app/
├── README.md              # Ce fichier
├── .gitignore            # Fichiers à ignorer
├── backend/              # API FastAPI
│   ├── main.py          # Application principale
│   ├── database.py      # Configuration DB
│   ├── models.py        # Modèles SQLAlchemy
│   ├── schemas.py       # Schémas Pydantic
│   ├── requirements.txt # Dépendances Python
│   └── README.md        # Documentation backend
└── frontend/            # Application React
    ├── package.json     # Dépendances Node
    ├── public/          # Fichiers publics
    └── src/             # Code source React
        ├── components/  # Composants réutilisables
        ├── pages/       # Pages de l'application
        ├── context/     # Context React (Auth)
        └── services/    # Services API
```

## 📚 Documentation

### Documentation API

Une fois le backend lancé, la documentation interactive est disponible sur :
- **Swagger UI** : `http://localhost:8000/docs`
- **ReDoc** : `http://localhost:8000/redoc`

### Documentation détaillée

- **Backend** : Voir `backend/README.md`
- **Frontend** : Voir `frontend/README.md` (si disponible)

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Authentification JWT
- ✅ Protection CORS configurée
- ✅ Validation des données côté serveur
- ✅ Isolation des données par utilisateur

## 🚀 Déploiement

### Backend

L'application peut être déployée sur :
- **Render** - `render.com`
- **Railway** - `railway.app`
- **Heroku** - `heroku.com`
- **VPS** - Serveur virtuel privé

### Frontend

L'application peut être déployée sur :
- **Vercel** - `vercel.com`
- **Netlify** - `netlify.com`
- **GitHub Pages** - `pages.github.com`
- **VPS** - Serveur virtuel privé

### Variables d'environnement

Pour la production, configurer :
- `SECRET_KEY` : Clé secrète pour JWT (à changer absolument)
- `DATABASE_URL` : URL de la base de données
- `CORS_ORIGINS` : Origines autorisées pour CORS

## 🐛 Dépannage

### Backend ne démarre pas

- Vérifier que Python 3.8+ est installé
- Vérifier que toutes les dépendances sont installées : `pip install -r requirements.txt`
- Vérifier que le port 8000 n'est pas déjà utilisé

### Frontend ne démarre pas

- Vérifier que Node.js 16+ est installé
- Vérifier que toutes les dépendances sont installées : `npm install`
- Vérifier que le port 3000 n'est pas déjà utilisé

### Erreurs de connexion API

- Vérifier que le backend est bien lancé sur `http://localhost:8000`
- Vérifier la configuration dans `frontend/src/services/api.js`
- Vérifier les erreurs dans la console du navigateur

## 📝 Notes importantes

- La base de données SQLite est créée automatiquement au premier lancement
- Le fichier `finance.db` sera créé dans le dossier `backend/`
- Pour la production, changez la `SECRET_KEY` dans `backend/main.py`
- Les données sont isolées par utilisateur (chaque utilisateur ne voit que ses propres données)

## 📄 Licence

Ce projet est fourni tel quel pour usage personnel.

## 🤝 Contribution

Ce projet est une application personnelle. Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026
