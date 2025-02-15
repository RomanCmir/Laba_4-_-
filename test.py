from fastapi.testclient import TestClient
from main import app
import requests
from fastapi import FastAPI, HTTPException
from fastapi import Depends, Security
from fastapi.security import OAuth2PasswordBearer
client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
def test_get_users():
    response = client.get("/users/")
    assert response.status_code == 401

def test_create_user():
    response = client.post(
    "/register/",
    json={"username": "testuser", "email": "testuser@example.com",
    "full_name": "Test User", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"

def test_successful_authentication():
    url = "http://localhost:8000/token"

    data = {"grant_type": "password","username": "testuser","password": "password123"}

    response = requests.post(url, data=data)

    if response.status_code == 200:
        print("Успешная аутентификация:", response.json())
    else:
        print("Ошибка аутентификации:", response.status_code, response.text)


def test_incorrect_username_password():
    url = "http://localhost:8000/token"

    data2 = {"grant_type": "password","username222": "testuser","password": "password123222"}

    response = requests.post(url, data=data2)

    if response.status_code == 401:
        print("Неверный пароль")


def test_get_current_user(client, auth_token):
    response = client.get("/users/me", headers=auth_token)
    assert response.status_code == 200

    data = response.json()
    assert data["username"] == "current_user"
    assert "email" in data 
