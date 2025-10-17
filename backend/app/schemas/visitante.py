from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VisitanteBase(BaseModel):
    nombre: str
    apellido: str
    dni: str

class VisitanteCreate(VisitanteBase):
    pass

class VisitanteOut(VisitanteBase):
    id: int
    created_at: datetime
    estado: bool

    class Config:
        orm_mode = True
