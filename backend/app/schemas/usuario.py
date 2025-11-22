from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    dni: str
    email: EmailStr
    departamento: str
    telefono: str
    rol: str
    
    class Config:
        orm_mode = True
        
class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioOut(UsuarioBase):
    id: int
    created_at: datetime
    estado: bool
    
    class Config:
        orm_mode = True
        