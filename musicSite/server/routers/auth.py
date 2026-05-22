from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt

from database import get_db
from models import User
from middleware.auth import JWT_SECRET, get_current_user

router = APIRouter(prefix='/user', tags=['用户认证'])
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@router.post('/verify-code')
def send_verify_code(body: dict, db: Session = Depends(get_db)):
    email = body.get('email', '')
    if not email:
        return {'code': 400, 'message': '邮箱不能为空'}
    return {'code': 200, 'data': {'message': '验证码已发送', 'code': '123456'}}


@router.post('/register')
def register(body: dict, db: Session = Depends(get_db)):
    email = body.get('email', '')
    password = body.get('password', '')
    verification_code = body.get('verificationCode', '')

    if not email or not password or not verification_code:
        return {'code': 400, 'message': '请填写完整信息'}

    if verification_code != '123456':
        return {'code': 400, 'message': '验证码错误'}

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return {'code': 400, 'message': '该邮箱已被注册'}

    username = email.split('@')[0]
    user = User(
        username=username,
        email=email,
        password=pwd_context.hash(password),
        nickname=username
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {'code': 200, 'data': {'message': '注册成功', 'userId': user.id}}


@router.post('/login')
def login(body: dict, db: Session = Depends(get_db)):
    email = body.get('email', '')
    password = body.get('password', '')

    if not email or not password:
        return {'code': 400, 'message': '请输入邮箱/用户名和密码'}

    user = db.query(User).filter(
        (User.email == email) | (User.username == email)
    ).first()

    if not user:
        return {'code': 400, 'message': '用户不存在，请先注册'}

    if not pwd_context.verify(password, user.password):
        return {'code': 400, 'message': '密码错误，请重试'}

    token = jwt.encode(
        {'id': user.id, 'email': user.email, 'nickname': user.nickname},
        JWT_SECRET,
        algorithm='HS256'
    )

    return {
        'code': 200,
        'data': {
            'token': token,
            'userInfo': {
                'id': user.id,
                'nickname': user.nickname,
                'email': user.email,
                'avatar': user.avatar,
                'createTime': user.create_time.isoformat() if user.create_time else None,
                'stats': {
                    'dynamic': user.dynamic_count,
                    'fans': user.fans_count,
                    'follow': user.follow_count
                }
            }
        }
    }


@router.post('/change-password')
def change_password(
    body: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    old_password = body.get('oldPassword', '')
    new_password = body.get('newPassword', '')

    user = db.query(User).filter(User.id == current_user['id']).first()

    if not pwd_context.verify(old_password, user.password):
        return {'code': 400, 'message': '原密码错误'}

    user.password = pwd_context.hash(new_password)
    db.commit()

    return {'code': 200, 'data': {'message': '密码修改成功'}}
