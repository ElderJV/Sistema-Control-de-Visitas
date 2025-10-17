import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    dni = Column(String(20), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    departamento = Column(String(8),nullable = False)
    telefono = Column(String(20), nullable=False)
    password = Column(String(255), nullable=False)
    rol = Column(String(20), nullable=False)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    
    visitas = relationship("Visita", back_populates="portero")
    vetados = relationship("Vetado", back_populates="visitado")
    autorizaciones = relationship("Autorizacion", back_populates="visitado")
    
