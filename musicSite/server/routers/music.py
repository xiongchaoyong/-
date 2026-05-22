from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Banner, Playlist, Song

router = APIRouter(tags=['音乐数据'])


@router.get('/banner')
def get_banners(db: Session = Depends(get_db)):
    banners = db.query(Banner).order_by(Banner.sort_order).all()
    data = [
        {
            'id': b.id,
            'title': b.title,
            'subtitle': b.subtitle,
            'bgColor': b.bg_color,
            'imageUrl': b.image_url,
            'link': b.link,
        }
        for b in banners
    ]
    return {'code': 200, 'data': data}


@router.get('/playlist/recommend')
def get_recommend_playlists(db: Session = Depends(get_db)):
    playlists = db.query(Playlist).all()
    data = [
        {
            'id': p.id,
            'name': p.name,
            'coverBg': p.cover_bg,
            'playCount': p.play_count,
            'creator': p.creator,
            'tags': p.tags.split(',') if p.tags else [],
            'songCount': p.song_count,
        }
        for p in playlists
    ]
    return {'code': 200, 'data': data}


@router.get('/songs')
def get_songs(db: Session = Depends(get_db)):
    songs = db.query(Song).all()
    data = [
        {
            'id': s.id,
            'name': s.name,
            'artist': s.artist,
            'album': s.album,
            'duration': s.duration,
            'isNew': bool(s.is_new),
            'cover': s.cover,
            'url': s.url,
        }
        for s in songs
    ]
    return {'code': 200, 'data': data}


@router.get('/songs/latest')
def get_latest_songs(db: Session = Depends(get_db)):
    songs = db.query(Song).filter(Song.is_new == 1).all()
    data = [
        {
            'id': s.id,
            'name': s.name,
            'artist': s.artist,
            'album': s.album,
            'duration': s.duration,
            'isNew': True,
            'cover': s.cover,
            'url': s.url,
        }
        for s in songs
    ]
    return {'code': 200, 'data': data}
