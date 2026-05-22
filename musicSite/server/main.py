import os
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import ensure_database, engine, Base
from seed import seed
from routers.auth import router as auth_router
from routers.music import router as music_router

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时：建库、建表、种子数据
    ensure_database()
    Base.metadata.create_all(bind=engine)
    seed()
    print(f'[Server] 后端服务已启动: http://localhost:{PORT}')
    print(f'[Server] API 地址: http://localhost:{PORT}/api')
    yield


app = FastAPI(title='Music Site API', lifespan=lifespan)
PORT = int(os.getenv('PORT', 3000))

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router, prefix='/api')
app.include_router(music_router, prefix='/api')


@app.get('/api/health')
def health():
    return {
        'code': 200,
        'data': {'status': 'ok', 'timestamp': datetime.now().isoformat()}
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=PORT, reload=True)
