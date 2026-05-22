from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    nickname = Column(String(100))
    avatar = Column(String(500), default='')
    create_time = Column(DateTime, server_default=func.now())
    dynamic_count = Column(Integer, default=0)
    fans_count = Column(Integer, default=0)
    follow_count = Column(Integer, default=0)


class Banner(Base):
    __tablename__ = 'banners'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(500), default='')
    bg_color = Column(String(20), default='#C62F2F')
    image_url = Column(String(500), default='')
    link = Column(String(500), default='')
    sort_order = Column(Integer, default=0)


class Playlist(Base):
    __tablename__ = 'playlists'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    cover_bg = Column(String(20), default='#333')
    play_count = Column(Integer, default=0)
    creator = Column(String(100), default='')
    tags = Column(String(500), default='')
    song_count = Column(Integer, default=0)


class Song(Base):
    __tablename__ = 'songs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    artist = Column(String(200), default='')
    album = Column(String(200), default='')
    duration = Column(Integer, default=0)
    is_new = Column(Integer, default=0)
    url = Column(String(500), default='')
    cover = Column(String(500), default='')


class PlaylistSong(Base):
    __tablename__ = 'playlist_songs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    playlist_id = Column(Integer, ForeignKey('playlists.id', ondelete='CASCADE'), nullable=False)
    song_id = Column(Integer, ForeignKey('songs.id', ondelete='CASCADE'), nullable=False)
