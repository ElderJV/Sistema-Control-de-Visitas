from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class CreateUserRequest(BaseModel):
    username: str
    password: str
    
class Token(BaseModel):
    acces_token: str
    token_type: str
    

    