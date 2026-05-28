import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bcrypt import hashpw, checkpw, gensalt

# Password hashing context
security = HTTPBearer()

class JWTService:

    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES"))
        self.refresh_token_expire_days = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS"))

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc)
        if expires_delta:
            expire = expire + expires_delta
        else:
            expire = expire + timedelta(minutes=self.access_token_expire_minutes)

        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_refresh_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc)
        if expires_delta:
            expire = expire + expires_delta
        else:
            expire = expire + timedelta(days=self.refresh_token_expire_days)

        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def decode_token(self, token: str) -> Optional[dict]:
        try:
            decoded_token = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return decoded_token
        except jwt.PyJWTError:
            return None

    @staticmethod
    def get_password_hash(password: str):
        return hashpw(password.encode('utf-8'), gensalt(12)).decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str):
        return checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

jwt_service = JWTService()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = jwt_service.decode_token(token)

    if not payload or payload.get("type") != "access" or payload.get("exp") < datetime.now().timestamp():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token"
        )
        

    return payload
