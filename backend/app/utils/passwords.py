import hashlib
import bcrypt
from typing import Union


def hash_password(password: Union[str, bytes]) -> str:
    """Pre-hash con SHA-256 y luego bcrypt.

    Devuelve el hash codificado en UTF-8 (bytes -> str).
    """
    if isinstance(password, str):
        password = password.encode("utf-8")
    # SHA-256 produce 32 bytes, seguro para bcrypt
    sha = hashlib.sha256(password).digest()
    hashed = bcrypt.hashpw(sha, bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: Union[str, bytes], hashed: str) -> bool:
    """Verifica usando el mismo pre-hash SHA-256 seguido de bcrypt.checkpw."""
    if isinstance(password, str):
        password = password.encode("utf-8")
    sha = hashlib.sha256(password).digest()
    return bcrypt.checkpw(sha, hashed.encode("utf-8"))
