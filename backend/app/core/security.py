from passlib.context import CryptContext
from jose import jwt,JWTError
from datetime import datetime, timedelta , timezone
from app.core.config import settings
from fastapi import HTTPException, status

password_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str):
   return password_context.hash(password.strip())

def verify_password(plain :str, hashed:str)-> bool:
   return password_context.verify(plain.strip(), hashed)

# def create_token(data: dict):
#     payload = data.copy()
#     payload["exp"] = datetime.now(timezone.utc) + timedelta(days=7)
#     return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(days=7)
    payload["iat"] = datetime.now(timezone.utc)
    payload["iss"] = "qr-order-app"   # 🔥
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)