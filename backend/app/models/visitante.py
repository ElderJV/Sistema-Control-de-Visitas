import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Visitante(Base):
    __tablename__ = "visitantes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dni = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    estado = Column(Boolean, default = True)
    
    visitas = relationship("Visita", back_populates="visitante")
    vetados = relationship("Vetado", back_populates="visitante")
    autorizaciones = relationship("Autorizacion", back_populates="visitante")