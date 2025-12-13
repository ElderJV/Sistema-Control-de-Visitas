# jwt_handler.py
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from datetime import timedelta, datetime
from dotenv import load_dotenv
from typing import Annotated
from fastapi import Depends, HTTPException
from starlette import status
from fastapi.security import OAuth2PasswordBearer
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

SECRET_KEY = os.getenv('S_KEY')
ALGORITHM = os.getenv('ALGORITHM')

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')


def create_access_token(usermail: str, userid: int, expires_delta: timedelta | None = None):
    """Crea un JWT con 'sub' y 'id'.

    Si no se pasa expires_delta, se usa 15 minutos por defecto.
    """
    if SECRET_KEY is None or ALGORITHM is None:
        raise RuntimeError("JWT configuration missing: check S_KEY and ALGORITHM env vars")

    encode = {"sub": usermail, "id": userid}
    if expires_delta is None:
        expires_delta = timedelta(minutes=15)
    expires = datetime.utcnow() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usermail: str = payload.get('sub')
        user_id: int = payload.get('id')
        if usermail is None or user_id is None:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incompletas en el token",
            )
        return {"usermail": usermail, "id": user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            )