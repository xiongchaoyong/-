const { Router } = require('express')
const db = require('../db')

const router = Router()

// 获取 Banner 列表
router.get('/banner', (req, res) => {
  const banners = db.prepare('SELECT * FROM banners ORDER BY sort_order').all()
  const data = banners.map(b => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    bgColor: b.bg_color,
    imageUrl: b.image_url,
    link: b.link
  }))
  res.json({ code: 200, data })
})

// 获取推荐歌单
router.get('/playlist/recommend', (req, res) => {
  const playlists = db.prepare('SELECT * FROM playlists').all()
  const data = playlists.map(p => ({
    id: p.id,
    name: p.name,
    coverBg: p.cover_bg,
    playCount: p.play_count,
    creator: p.creator,
    tags: p.tags ? p.tags.split(',') : [],
    songCount: p.song_count
  }))
  res.json({ code: 200, data })
})

// 获取所有歌曲
router.get('/songs', (req, res) => {
  const songs = db.prepare('SELECT * FROM songs').all()
  const data = songs.map(s => ({
    id: s.id,
    name: s.name,
    artist: s.artist,
    album: s.album,
    duration: s.duration,
    isNew: !!s.is_new,
    cover: s.cover,
    url: s.url
  }))
  res.json({ code: 200, data })
})

// 获取最新歌曲（is_new = 1）
router.get('/songs/latest', (req, res) => {
  const songs = db.prepare('SELECT * FROM songs WHERE is_new = 1').all()
  const data = songs.map(s => ({
    id: s.id,
    name: s.name,
    artist: s.artist,
    album: s.album,
    duration: s.duration,
    isNew: true,
    cover: s.cover,
    url: s.url
  }))
  res.json({ code: 200, data })
})

module.exports = router
