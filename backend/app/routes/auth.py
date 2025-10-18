# auth.py
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from app.database import get_db
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.models.usuario import Usuario
from app.utils.passwords import verify_password
from datetime import timedelta
from app.utils.jwt_handler import create_access_token, get_current_user


class Token(BaseModel):
    access_token: str
    token_type: str

router = APIRouter(prefix="/auth", tags=['auth'])

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/token',response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El usuario no es válido",
        )
    token = create_access_token(user.email, user.id, timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/",status_code=status.HTTP_200_OK)
async def user(token: user_dependency, db: Session = Depends(get_db)):
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticacion fallida",
        )
    return {"User": token}


def authenticate_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

