# Guide de Dépannage - Problèmes d'Inscription

## Vérifications à faire

### 1. Backend est-il lancé ?

Vérifiez que le backend est bien lancé :
```bash
cd D:\finance-app\backend
uvicorn main:app --reload
```

Vous devriez voir :
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 2. Dépendances installées ?

Dans le dossier backend, installez les dépendances :
```bash
pip install -r requirements.txt
```

**Important** : Assurez-vous d'avoir installé `email-validator` :
```bash
pip install email-validator==2.1.0
```

### 3. Base de données créée ?

La base de données `finance.db` devrait être créée automatiquement au premier lancement du backend.

### 4. CORS configuré ?

Vérifiez que dans `backend/main.py`, les origines CORS incluent `http://localhost:3000`

### 5. Console du navigateur

Ouvrez la console du navigateur (F12) et regardez les erreurs :
- Erreurs réseau (CORS, connexion refusée)
- Erreurs JavaScript

### 6. Console du backend

Regardez les logs du backend pour voir les erreurs serveur.

## Erreurs courantes

### "Email already registered"
- L'email est déjà utilisé, essayez un autre email

### "Impossible de se connecter au serveur"
- Le backend n'est pas lancé
- Le backend n'écoute pas sur le port 8000
- Vérifiez l'URL dans `frontend/src/services/api.js`

### "Validation error"
- Vérifiez que l'email est valide
- Vérifiez que le mot de passe fait au moins 6 caractères

### Erreur 500 (Internal Server Error)
- Vérifiez les logs du backend
- Vérifiez que toutes les dépendances sont installées
- Vérifiez que la base de données peut être créée
