const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')

const DB_PATH = path.join(__dirname, 'data', 'music.db')

// 确保 data 目录存在
const fs = require('fs')
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)

// 启用 WAL 模式提升并发性能
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// ========== 建表 ==========
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT,
      avatar TEXT DEFAULT '',
      create_time TEXT DEFAULT (datetime('now', 'localtime')),
      dynamic_count INTEGER DEFAULT 0,
      fans_count INTEGER DEFAULT 0,
      follow_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      bg_color TEXT DEFAULT '#C62F2F',
      image_url TEXT DEFAULT '',
      link TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover_bg TEXT DEFAULT '#333',
      play_count INTEGER DEFAULT 0,
      creator TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      song_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      artist TEXT DEFAULT '',
      album TEXT DEFAULT '',
      duration INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      url TEXT DEFAULT '',
      cover TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS playlist_songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playlist_id INTEGER NOT NULL,
      song_id INTEGER NOT NULL,
      FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
      FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );
  `)
}

// ========== 种子数据 ==========
function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (userCount.count > 0) return // 已有数据，跳过

  const hash = bcrypt.hashSync('Abc123', 10)

  // 插入演示用户
  db.prepare(`
    INSERT INTO users (username, email, password, nickname, dynamic_count, fans_count, follow_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('testuser', 'test@music.com', hash, '音乐爱好者', 12, 56, 38)

  // 插入 Banner
  const insertBanner = db.prepare(`
    INSERT INTO banners (title, subtitle, bg_color, sort_order) VALUES (?, ?, ?, ?)
  `)

  const banners = [
    ['华语精选', '那些年我们听过的经典', '#8B1A1A', 1],
    ['电音风暴', '感受电子音乐的魅力', '#1A3A5C', 2],
    ['民谣与诗', '用音乐诉说故事', '#4A7C59', 3],
    ['爵士之夜', '慵懒惬意的爵士时光', '#5C3A6B', 4],
    ['摇滚不死', '燃爆全场的摇滚力量', '#8B4513', 5],
    ['新歌速递', '第一时间听见好歌', '#2C5F7C', 6]
  ]
  for (const b of banners) insertBanner.run(...b)

  // 插入歌单
  const insertPlaylist = db.prepare(`
    INSERT INTO playlists (name, cover_bg, play_count, creator, tags, song_count) VALUES (?, ?, ?, ?, ?, ?)
  `)

  const playlists = [
    ['华语新歌榜 | 最新最热华语歌曲', '#2a1a3a', 12580000, '音悦台官方', '华语,流行', 30],
    ['治愈纯音 | 安静的时候听', '#1a3a2a', 8960000, '音乐疗愈所', '纯音乐,治愈', 25],
    ['摇滚力量 | 释放你的激情', '#3a1a1a', 6540000, '摇滚之声', '摇滚,力量', 28],
    ['电子狂潮 | 感受电音魅力', '#1a2a3a', 11200000, 'DJ电音', '电子,DJ', 35],
    ['经典金曲 | 那些年的回忆', '#3a2a1a', 15800000, '音乐档案馆', '经典,怀旧', 40],
    ['说唱新势力 | 中文说唱精选', '#1a1a3a', 7830000, '说唱厂牌', '说唱,Hip-Hop', 22],
    ['睡前轻音乐 | 助眠纯音乐', '#2a3a3a', 9450000, '晚安音乐', '轻音乐,助眠', 20],
    ['古风雅韵 | 国风音乐精选', '#3a2a2a', 5210000, '古风社', '古风,国风', 26],
    ['爵士咖啡 | 慵懒午后时光', '#2a2a1a', 4320000, '爵士俱乐部', '爵士,咖啡', 18],
    ['K-Pop热单 | 韩流音乐合集', '#3a1a2a', 10900000, '韩流前线', 'K-Pop,韩语', 32]
  ]
  for (const p of playlists) insertPlaylist.run(...p)

  // 插入歌曲（全部歌曲）
  const insertSong = db.prepare(`
    INSERT INTO songs (name, artist, album, duration, is_new) VALUES (?, ?, ?, ?, ?)
  `)

  const allSongs = [
    ['晴天', '周杰伦', '叶惠美', 269, 0],
    ['起风了', '买辣椒也用券', '起风了', 305, 0],
    ['夜曲', '周杰伦', '十一月的萧邦', 226, 0],
    ['孤勇者', '陈奕迅', '孤勇者', 248, 0],
    ['平凡之路', '朴树', '猎户星座', 312, 0],
    ['告白气球', '周杰伦', '周杰伦的床边故事', 215, 0],
    ['光年之外', '邓紫棋', '光年之外', 235, 0],
    ['年少有为', '李荣浩', '耳朵', 278, 0],
    ['后来', '刘若英', '我等你', 324, 0],
    ['十年', '陈奕迅', '黑白灰', 205, 0],
    ['如果可以', '韦礼安', '如果可以', 268, 1],
    ['错位时空', '艾辰', '错位时空', 215, 1],
    ['星辰大海', '黄霄云', '星辰大海', 263, 1],
    ['踏山河', '七叔（叶泽浩）', '踏山河', 193, 1],
    ['莫问归期', '蒋雪儿', '莫问归期', 245, 1],
    ['白月光与朱砂痣', '大籽', '白月光与朱砂痣', 210, 1],
    ['赤伶', 'HITA', '赤伶', 280, 1],
    ['一路生花', '温奕心', '一路生花', 255, 1]
  ]
  for (const s of allSongs) insertSong.run(...s)

  // 建立歌单-歌曲关联（简单分配：每个歌单前几首歌）
  const insertPS = db.prepare('INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)')
  for (let pl = 1; pl <= 10; pl++) {
    for (let si = 1; si <= 6; si++) {
      const songId = ((pl - 1) * 3 + si - 1) % 18 + 1
      insertPS.run(pl, songId)
    }
  }
}

// ========== 初始化 ==========
initSchema()
seed()

module.exports = db
