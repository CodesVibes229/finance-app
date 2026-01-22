# Backend - API FastAPI

API REST pour l'application de gestion des finances personnelles.

## 📋 Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

## 🚀 Installation

1. Créer un environnement virtuel (recommandé) :

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. Installer les dépendances :

```bash
pip install -r requirements.txt
```

## ▶️ Lancement

```bash
uvicorn main:app --reload
```

L'API sera accessible sur :
- **URL principale** : `http://localhost:8000`
- **Documentation interactive (Swagger UI)** : `http://localhost:8000/docs`
- **Documentation alternative (ReDoc)** : `http://localhost:8000/redoc`

## 📁 Structure des fichiers

```
backend/
├── main.py          # Application FastAPI principale avec toutes les routes
├── database.py      # Configuration de la base de données SQLite
├── models.py        # Modèles SQLAlchemy (User, Income, Expense, Budget, SavingsGoal)
├── schemas.py       # Schémas Pydantic pour validation des données
└── requirements.txt # Dépendances Python
```

## 🔌 Endpoints API

### Authentification

- `POST /register` - Inscription d'un nouvel utilisateur
- `POST /token` - Connexion (obtention du token JWT)
- `GET /users/me` - Informations de l'utilisateur connecté

### Revenus

- `GET /incomes` - Liste des revenus
- `POST /incomes` - Créer un revenu
- `GET /incomes/{id}` - Détails d'un revenu
- `PUT /incomes/{id}` - Modifier un revenu
- `DELETE /incomes/{id}` - Supprimer un revenu

### Dépenses

- `GET /expenses` - Liste des dépenses
- `POST /expenses` - Créer une dépense
- `GET /expenses/{id}` - Détails d'une dépense
- `PUT /expenses/{id}` - Modifier une dépense
- `DELETE /expenses/{id}` - Supprimer une dépense

### Budgets

- `GET /budgets` - Liste des budgets
- `POST /budgets` - Créer un budget
- `PUT /budgets/{id}` - Modifier un budget
- `DELETE /budgets/{id}` - Supprimer un budget

### Objectifs d'épargne

- `GET /savings-goals` - Liste des objectifs
- `POST /savings-goals` - Créer un objectif
- `PUT /savings-goals/{id}` - Modifier un objectif
- `DELETE /savings-goals/{id}` - Supprimer un objectif

### Dashboard & Export

- `GET /dashboard` - Statistiques du tableau de bord
- `GET /export/csv` - Export des données en CSV
- `GET /export/excel` - Export des données en Excel

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

1. **Inscription** : `POST /register` avec email, password, full_name (optionnel)
2. **Connexion** : `POST /token` avec username (email) et password
3. **Utilisation** : Ajouter le header `Authorization: Bearer <token>` aux requêtes

## 🗄️ Base de données

La base de données SQLite (`finance.db`) est créée automatiquement au premier lancement.

### Modèles

- **User** : Utilisateurs de l'application
- **Income** : Revenus
- **Expense** : Dépenses
- **Budget** : Budgets mensuels par catégorie
- **SavingsGoal** : Objectifs d'épargne

## 🔧 Configuration

### Variables d'environnement (optionnel)

Pour la production, créer un fichier `.env` :

```
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire
DATABASE_URL=sqlite:///./finance.db
```

**Note** : Actuellement, la clé secrète est définie dans `main.py`. Pour la production, utilisez une variable d'environnement.

## 📦 Dépendances principales

- **FastAPI** : Framework web moderne et rapide
- **SQLAlchemy** : ORM pour la base de données
- **Pydantic** : Validation des données
- **python-jose** : Gestion des tokens JWT
- **passlib** : Hashage des mots de passe (bcrypt)
- **openpyxl** : Génération de fichiers Excel

## 🧪 Test de l'API

Vous pouvez tester l'API directement via la documentation Swagger UI disponible sur `/docs` après le lancement du serveur.

### Exemple avec curl

```bash
# Inscription
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123", "full_name": "Test User"}'

# Connexion
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"

# Utiliser le token obtenu
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

## 🚀 Déploiement

Pour la production, utilisez un serveur ASGI comme :

- **Gunicorn** avec Uvicorn workers
- **Uvicorn** en mode production
- **Docker** avec une image Python

Exemple avec Gunicorn :

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📝 Notes

- La base de données SQLite est créée automatiquement
- Tous les endpoints (sauf `/register` et `/token`) nécessitent une authentification
- Les données sont isolées par utilisateur (chaque utilisateur ne voit que ses propres données)
- Le secret key doit être changé en production
