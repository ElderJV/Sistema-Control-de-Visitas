from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from app.database import get_db
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.models.usuario import Usuario


router = APIRouter(prefix="/auth", tags=['auth'])


oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')
