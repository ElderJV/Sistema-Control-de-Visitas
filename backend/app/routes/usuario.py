from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut
from app.utils.passwords import hash_password


router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
# Crear un nuevo usuario
@router.post("/", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED) 
async def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario ya existe")
    
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        dni=usuario.dni,
        email=usuario.email,
        departamento=usuario.departamento,
        telefono=usuario.telefono,
        password= hash_password(usuario.password),
        rol=usuario.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

# Obtener un usuario por ID
@router.get("/{usuario_id}", response_model=UsuarioOut)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return usuario

# Listar todos los usuarios
@router.get("/", response_model=list[UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()
    return usuarios

# Actualizar un usuario
@router.put("/{usuario_id}", response_model=UsuarioOut)
def actualizar_info_usuario(usuario_id: int, usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    db_usuario.nombre = usuario.nombre
    db_usuario.apellido = usuario.apellido
    db_usuario.dni = usuario.dni
    db_usuario.email = usuario.email
    db_usuario.departamento = usuario.departamento
    db_usuario.telefono = usuario.telefono
    db_usuario.password = hash_password(usuario.password)
    db_usuario.rol = usuario.rol

    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Eliminacion logica de usuario
@router.patch("/{usuario_id}", response_model=UsuarioOut)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    if  db_usuario.estado:
        db_usuario.estado = False
    else:
        raise HTTPException(status_code=status.HTTP_208_ALREADY_REPORTED, detail="El usuario ya esta eliminado")
    db.commit()
    db.refresh(db_usuario)
    return db_usuario