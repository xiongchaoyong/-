import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

security_scheme = HTTPBearer()
JWT_SECRET = os.getenv('JWT_SECRET', 'music_site_jwt_secret_key_2024')


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=['HS256'])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='登录已过期，请重新登录'
        )
