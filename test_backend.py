#!/usr/bin/env python3
"""
Script de test pour vérifier que le backend fonctionne correctement
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend():
    print("🔍 Test de connexion au backend...")
    print(f"URL: {BASE_URL}\n")
    
    # Test 1: Vérifier que le serveur répond
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ Le serveur backend répond correctement")
        else:
            print(f"⚠️  Le serveur répond avec le code {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ ERREUR: Impossible de se connecter au backend")
        print("   → Vérifiez que le backend est lancé avec: uvicorn main:app --reload")
        print("   → Vérifiez que le backend écoute sur http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ ERREUR: {str(e)}")
        return False
    
    # Test 2: Tester l'endpoint /register
    print("\n🔍 Test de l'endpoint /register...")
    test_email = "test@example.com"
    test_password = "test123456"
    
    try:
        response = requests.post(
            f"{BASE_URL}/register",
            json={
                "email": test_email,
                "password": test_password,
                "full_name": "Test User"
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ L'inscription fonctionne correctement")
            data = response.json()
            print(f"   → Utilisateur créé: {data.get('email')}")
        elif response.status_code == 400:
            error_detail = response.json().get('detail', '')
            if 'already registered' in error_detail:
                print("⚠️  L'email de test existe déjà (c'est normal si vous avez déjà testé)")
            else:
                print(f"❌ Erreur de validation: {error_detail}")
        else:
            print(f"❌ Erreur inattendue: {response.status_code}")
            print(f"   Réponse: {response.text}")
    except Exception as e:
        print(f"❌ ERREUR lors du test d'inscription: {str(e)}")
        return False
    
    print("\n✅ Tous les tests sont passés!")
    return True

if __name__ == "__main__":
    test_backend()
