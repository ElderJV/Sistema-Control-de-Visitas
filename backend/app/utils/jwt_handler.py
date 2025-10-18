from jose import jwt, JWTError
from datetime import timedelta, datetime
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("S_KEY")
ALGORITHM = os.getenv("ALGORITHM")

