<script setup>
import { ref, onMounted } from 'vue'
import Banner from '@/components/Banner.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import SongCard from '@/components/SongCard.vue'
import LeftSidebar from '@/components/LeftSidebar.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import { getRecommendPlaylists, getLatestSongs } from '@/api/modules/music'
import { usePlayerStore } from '@/stores/player'
import { ElMessage } from 'element-plus'

const playerStore = usePlayerStore()
const playlists = ref([])
const latestSongs = ref([])
const loading = ref(true)

async function loadData() {
  loading.value = true
  try {
    const [plRes, songRes] = await Promise.all([
      getRecommendPlaylists(),
      getLatestSongs()
    ])
    playlists.value = plRes.data
    latestSongs.value = songRes.data
  } catch (e) {
    console.error('加载失败:', e)
  } finally {
    loading.value = false
  }
}

function playAll() {
  if (latestSongs.value.length > 0) {
    playerStore.setPlaylist(latestSongs.value)
    ElMessage.success('开始播放最新音乐')
  }
}

onMounted(loadData)
</script>

<template>
  <div class="discover-wrapper">
    <div class="discover-layout">
      <!-- 左栏 -->
      <LeftSidebar />

      <!-- 中栏 -->
      <main class="discover-center">
        <!-- 轮播图 -->
        <Banner />

        <!-- 推荐歌单 -->
        <section class="section">
          <div class="section-head">
            <h3 class="section-title">推荐歌单</h3>
            <span class="section-more">更多 &gt;</span>
          </div>
          <el-skeleton :loading="loading" animated :count="10">
            <template #template>
              <div class="playlist-grid">
                <div v-for="i in 10" :key="i">
                  <el-skeleton-item variant="image" style="width:100%;padding-bottom:100%" />
                  <el-skeleton-item variant="text" style="width:80%;margin-top:6px" />
                </div>
              </div>
            </template>
            <template #default>
              <div class="playlist-grid">
                <PlaylistCard
                  v-for="item in playlists"
                  :key="item.id"
                  :playlist="item"
                />
              </div>
            </template>
          </el-skeleton>
        </section>

        <!-- 最新音乐 -->
        <section class="section">
          <div class="section-head">
            <h3 class="section-title">最新音乐</h3>
            <button class="btn-play-all" @click="playAll">
              <el-icon size="14"><VideoPlay /></el-icon>
              播放全部
            </button>
          </div>
          <el-skeleton :loading="loading" animated :count="8">
            <template #template>
              <div style="padding:0 10px">
                <el-skeleton-item v-for="i in 8" :key="i" variant="text" style="width:100%;height:30px;margin-bottom:1px" />
              </div>
            </template>
            <template #default>
              <div class="song-table">
                <div class="song-header">
                  <span class="col-index">#</span>
                  <span class="col-title">歌曲</span>
                  <span class="col-artist">歌手</span>
                  <span class="col-album">专辑</span>
                  <span class="col-duration">时长</span>
                  <span class="col-play"></span>
                </div>
                <SongCard
                  v-for="(song, idx) in latestSongs"
                  :key="song.id"
                  :song="song"
                  :index="idx + 1"
                />
              </div>
            </template>
          </el-skeleton>
        </section>

        <!-- 新碟上架 -->
        <section class="section">
          <div class="section-head">
            <h3 class="section-title">新碟上架</h3>
            <span class="section-more">更多 &gt;</span>
          </div>
          <div class="album-scroll">
            <div
              v-for="item in playlists.slice(0, 6)"
              :key="'album-' + item.id"
              class="album-item"
            >
              <div class="album-cover" :style="{ backgroundColor: item.coverBg }">
                <span class="album-icon">&#9835;</span>
              </div>
              <p class="album-name">{{ item.name }}</p>
              <p class="album-artist">{{ item.creator }}</p>
            </div>
          </div>
        </section>
      </main>

      <!-- 右栏 -->
      <RightSidebar />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discover-wrapper {
  max-width: $content-outer;
  margin: 0 auto;
  padding: 20px;
  min-height: 100%;
}

.discover-layout {
  display: flex;
  gap: $sidebar-gap;
  align-items: flex-start;
}

// 中栏
.discover-center {
  flex: 1;
  max-width: $content-center;
  min-width: 0;
}

.section {
  margin-bottom: 32px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-bottom: 2px solid $theme-red;
  margin-bottom: 14px;

  .section-title {
    font-size: $font-xxl;
    font-weight: 600;
    color: $text-primary;
  }

  .section-more {
    font-size: $font-sm;
    color: $text-muted;
    cursor: pointer;
    &:hover { color: $theme-red; }
  }

  .btn-play-all {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: $font-sm;
    color: $text-white;
    background: $theme-red;
    padding: 4px 16px;
    border-radius: 14px;
    &:hover { background: $theme-red-hover; }
  }
}

// 歌单网格
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px 12px;
}

// 歌曲表格
.song-table {
  border: 1px solid #e8e8e8;
  border-radius: $radius-sm;
  overflow: hidden;
}

.song-header {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 10px;
  background: #f5f5f5;
  font-size: $font-sm;
  color: $text-muted;
  border-bottom: 1px solid #e8e8e8;

  .col-index   { width: 36px; text-align: center; flex-shrink: 0; }
  .col-title   { flex: 3; }
  .col-artist  { flex: 2; }
  .col-album   { flex: 2; }
  .col-duration{ width: 44px; text-align: right; flex-shrink: 0; }
  .col-play    { width: 28px; flex-shrink: 0; }
}

// 新碟上架
.album-scroll {
  display: flex;
  gap: 14px;
}

.album-item {
  flex: 1;
  cursor: pointer;

  .album-cover {
    width: 100%;
    padding-bottom: 100%;
    border-radius: $radius-sm;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .album-icon {
      font-size: 32px;
      color: rgba(255,255,255,0.6);
    }
  }

  .album-name {
    font-size: $font-sm;
    color: $text-primary;
    margin-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .album-artist {
    font-size: $font-xs;
    color: $text-muted;
    margin-top: 2px;
  }
}
</style>
