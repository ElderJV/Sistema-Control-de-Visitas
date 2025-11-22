from fastapi import FastAPI
from app.database import Base,engine
from app.routes import usuario, visita, autorizacion, vetado, visitante, auth
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Control de Visitas", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

listaRutas = [usuario.router, visita.router, autorizacion.router, vetado.router, visitante.router, auth.router]

for ruta in listaRutas:
    app.include_router(ruta)
