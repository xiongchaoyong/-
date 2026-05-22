from passlib.context import CryptContext
from database import SessionLocal
from models import User, Banner, Playlist, Song, PlaylistSong

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def seed():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return  # 已有数据，跳过

        # 演示用户
        db.add(User(
            username='testuser',
            email='test@music.com',
            password=pwd_context.hash('Abc123'),
            nickname='音乐爱好者',
            dynamic_count=12,
            fans_count=56,
            follow_count=38
        ))

        # Banner
        banners = [
            Banner(title='华语精选', subtitle='那些年我们听过的经典', bg_color='#8B1A1A', sort_order=1),
            Banner(title='电音风暴', subtitle='感受电子音乐的魅力', bg_color='#1A3A5C', sort_order=2),
            Banner(title='民谣与诗', subtitle='用音乐诉说故事', bg_color='#4A7C59', sort_order=3),
            Banner(title='爵士之夜', subtitle='慵懒惬意的爵士时光', bg_color='#5C3A6B', sort_order=4),
            Banner(title='摇滚不死', subtitle='燃爆全场的摇滚力量', bg_color='#8B4513', sort_order=5),
            Banner(title='新歌速递', subtitle='第一时间听见好歌', bg_color='#2C5F7C', sort_order=6),
        ]
        db.add_all(banners)

        # 歌单
        playlists = [
            Playlist(name='华语新歌榜 | 最新最热华语歌曲', cover_bg='#2a1a3a', play_count=12580000, creator='音悦台官方', tags='华语,流行', song_count=30),
            Playlist(name='治愈纯音 | 安静的时候听', cover_bg='#1a3a2a', play_count=8960000, creator='音乐疗愈所', tags='纯音乐,治愈', song_count=25),
            Playlist(name='摇滚力量 | 释放你的激情', cover_bg='#3a1a1a', play_count=6540000, creator='摇滚之声', tags='摇滚,力量', song_count=28),
            Playlist(name='电子狂潮 | 感受电音魅力', cover_bg='#1a2a3a', play_count=11200000, creator='DJ电音', tags='电子,DJ', song_count=35),
            Playlist(name='经典金曲 | 那些年的回忆', cover_bg='#3a2a1a', play_count=15800000, creator='音乐档案馆', tags='经典,怀旧', song_count=40),
            Playlist(name='说唱新势力 | 中文说唱精选', cover_bg='#1a1a3a', play_count=7830000, creator='说唱厂牌', tags='说唱,Hip-Hop', song_count=22),
            Playlist(name='睡前轻音乐 | 助眠纯音乐', cover_bg='#2a3a3a', play_count=9450000, creator='晚安音乐', tags='轻音乐,助眠', song_count=20),
            Playlist(name='古风雅韵 | 国风音乐精选', cover_bg='#3a2a2a', play_count=5210000, creator='古风社', tags='古风,国风', song_count=26),
            Playlist(name='爵士咖啡 | 慵懒午后时光', cover_bg='#2a2a1a', play_count=4320000, creator='爵士俱乐部', tags='爵士,咖啡', song_count=18),
            Playlist(name='K-Pop热单 | 韩流音乐合集', cover_bg='#3a1a2a', play_count=10900000, creator='韩流前线', tags='K-Pop,韩语', song_count=32),
        ]
        db.add_all(playlists)
        db.flush()  # 获取 playlist id

        # 歌曲
        songs_data = [
            ('晴天', '周杰伦', '叶惠美', 269, 0),
            ('起风了', '买辣椒也用券', '起风了', 305, 0),
            ('夜曲', '周杰伦', '十一月的萧邦', 226, 0),
            ('孤勇者', '陈奕迅', '孤勇者', 248, 0),
            ('平凡之路', '朴树', '猎户星座', 312, 0),
            ('告白气球', '周杰伦', '周杰伦的床边故事', 215, 0),
            ('光年之外', '邓紫棋', '光年之外', 235, 0),
            ('年少有为', '李荣浩', '耳朵', 278, 0),
            ('后来', '刘若英', '我等你', 324, 0),
            ('十年', '陈奕迅', '黑白灰', 205, 0),
            ('如果可以', '韦礼安', '如果可以', 268, 1),
            ('错位时空', '艾辰', '错位时空', 215, 1),
            ('星辰大海', '黄霄云', '星辰大海', 263, 1),
            ('踏山河', '七叔（叶泽浩）', '踏山河', 193, 1),
            ('莫问归期', '蒋雪儿', '莫问归期', 245, 1),
            ('白月光与朱砂痣', '大籽', '白月光与朱砂痣', 210, 1),
            ('赤伶', 'HITA', '赤伶', 280, 1),
            ('一路生花', '温奕心', '一路生花', 255, 1),
        ]
        songs = [Song(name=n, artist=a, album=al, duration=d, is_new=nw) for n, a, al, d, nw in songs_data]
        db.add_all(songs)
        db.flush()  # 获取 song id

        # 歌单-歌曲关联
        for pl_id in range(1, 11):
            for si in range(1, 7):
                song_id = ((pl_id - 1) * 3 + si - 1) % 18 + 1
                db.add(PlaylistSong(playlist_id=pl_id, song_id=song_id))

        db.commit()
        print('[Seed] 种子数据插入完成')
    finally:
        db.close()
