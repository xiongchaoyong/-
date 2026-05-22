<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useAudio } from '@/composables/useAudio'

const playerStore = usePlayerStore()
const {
  currentTimeDisplay,
  durationDisplay,
  progressPercent,
  seekTo
} = useAudio()

const showPlaylist = ref(false)
const volumeSliderVisible = ref(false)
const progressBarRef = ref(null)
const progressDrag = ref(false)

const volumeIcon = computed(() => {
  if (playerStore.volume === 0) return 'Mute'
  if (playerStore.volume < 0.5) return 'Microphone'
  return 'VideoCamera'
})

const playModeLabel = computed(() => ({
  list: '列表循环', random: '随机播放', single: '单曲循环'
}[playerStore.playMode]))

function handleProgressClick(e) {
  const rect = e.target.getBoundingClientRect()
  seekTo(((e.clientX - rect.left) / rect.width) * 100)
}

function handleProgressDrag(e) {
  if (!progressDrag.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  seekTo(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
}

function onMouseDown() {
  progressDrag.value = true
  document.addEventListener('mousemove', handleProgressDrag)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseUp() {
  progressDrag.value = false
  document.removeEventListener('mousemove', handleProgressDrag)
  document.removeEventListener('mouseup', onMouseUp)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleProgressDrag)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <footer class="app-player">
    <!-- 进度条 -->
    <div
      ref="progressBarRef"
      class="progress-bar"
      @mousedown="onMouseDown"
      @click="handleProgressClick"
    >
      <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
      <div
        class="progress-thumb"
        :style="{ left: progressPercent + '%' }"
        @mousedown.stop="onMouseDown"
      />
    </div>

    <div class="player-body">
      <!-- 左：歌曲信息 -->
      <div class="player-left">
        <div class="song-cover" :class="{ empty: !playerStore.hasSong }">
          <span v-if="playerStore.hasSong" class="cover-icon">&#9835;</span>
          <span v-else class="cover-placeholder">&#9835;</span>
        </div>
        <div class="song-meta" v-if="playerStore.hasSong">
          <div class="song-name">{{ playerStore.currentSong.name }}</div>
          <div class="song-artist">{{ playerStore.currentSong.artist }}</div>
        </div>
        <div class="song-meta" v-else>
          <div class="song-name empty">音悦台</div>
        </div>
      </div>

      <!-- 中：播放控制 -->
      <div class="player-center">
        <div class="controls">
          <button class="ctrl-btn" @click="playerStore.switchPlayMode()" :title="playModeLabel">
            <el-icon size="16"><component :is="playerStore.playModeIcon" /></el-icon>
          </button>
          <button class="ctrl-btn" :disabled="!playerStore.hasSong" @click="playerStore.prev()">
            <el-icon size="20"><DArrowLeft /></el-icon>
          </button>
          <button class="ctrl-btn btn-play" :disabled="!playerStore.hasSong" @click="playerStore.togglePlay()">
            <el-icon :size="26">
              <VideoPause v-if="playerStore.isPlaying" />
              <VideoPlay v-else />
            </el-icon>
          </button>
          <button class="ctrl-btn" :disabled="!playerStore.hasSong" @click="playerStore.next()">
            <el-icon size="20"><DArrowRight /></el-icon>
          </button>

          <!-- 音量 -->
          <div
            class="volume-wrap"
            @mouseenter="volumeSliderVisible = true"
            @mouseleave="volumeSliderVisible = false"
          >
            <button class="ctrl-btn" @click="playerStore.toggleMute()">
              <el-icon size="14"><component :is="volumeIcon" /></el-icon>
            </button>
            <transition name="fade">
              <div class="volume-slider-box" v-show="volumeSliderVisible">
                <el-slider
                  v-model="playerStore.volume"
                  :min="0" :max="1" :step="0.05"
                  vertical height="80px" :show-tooltip="false"
                />
              </div>
            </transition>
          </div>
        </div>

        <div class="time-row">
          <span>{{ currentTimeDisplay }}</span>
          <span> / </span>
          <span>{{ durationDisplay }}</span>
        </div>
      </div>

      <!-- 右：播放列表 -->
      <div class="player-right">
        <el-badge :value="playerStore.playlistLength" :hidden="playerStore.playlistLength === 0">
          <button class="ctrl-btn" @click="showPlaylist = !showPlaylist">
            <el-icon size="18"><Tickets /></el-icon>
          </button>
        </el-badge>
      </div>
    </div>

    <!-- 播放列表面板 -->
    <transition name="slide-up">
      <div class="playlist-panel" v-show="showPlaylist">
        <div class="panel-head">
          <span>播放列表（{{ playerStore.playlistLength }} 首）</span>
          <button class="btn-clear" @click="playerStore.clearPlaylist(); showPlaylist = false">清空</button>
        </div>
        <div class="panel-body">
          <div
            v-for="(s, idx) in playerStore.playlist"
            :key="idx"
            class="panel-item"
            :class="{ active: idx === playerStore.currentIndex && playerStore.isPlaying }"
            @dblclick="playerStore.play(idx)"
          >
            <span class="item-status">
              <span v-if="idx === playerStore.currentIndex && playerStore.isPlaying" class="playing">&#9835;</span>
              <span v-else class="item-num">{{ idx + 1 }}</span>
            </span>
            <div class="item-meta">
              <span class="item-name">{{ s.name }}</span>
              <span class="item-artist"> - {{ s.artist }}</span>
            </div>
            <button class="item-remove" @click.stop="playerStore.removeFromPlaylist(idx)">
              <el-icon size="12"><Close /></el-icon>
            </button>
          </div>
          <div v-if="playerStore.playlistLength === 0" class="panel-empty">播放列表为空</div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<style lang="scss" scoped>
.app-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  border-top: 1px solid #e1e1e1;
  user-select: none;
}

.progress-bar {
  height: 3px;
  background: #ededed;
  cursor: pointer;
  position: relative;

  .progress-fill {
    height: 100%;
    background: $theme-red;
    transition: width 0.1s linear;
  }

  .progress-thumb {
    position: absolute;
    top: -6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $theme-red;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
  }

  &:hover .progress-thumb { opacity: 1; }
}

.player-body {
  height: $player-height; // 53px
  max-width: $content-outer;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.player-left {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 220px;
  flex-shrink: 0;

  .song-cover {
    width: 34px;
    height: 34px;
    border-radius: $radius-sm;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.empty {
      background: linear-gradient(135deg, $theme-red, #e55);
    }

    .cover-icon { font-size: 16px; color: $text-muted; }
    .cover-placeholder { color: #fff; font-size: 16px; }
  }

  .song-meta {
    min-width: 0;
    .song-name {
      font-size: $font-sm;
      color: $text-primary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.empty { color: $text-muted; }
    }
    .song-artist {
      font-size: $font-xs;
      color: $text-muted;
      margin-top: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ctrl-btn {
  color: #555;
  padding: 3px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    color: $theme-red;
    background: rgba($theme-red, 0.06);
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }

  &.btn-play {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $theme-red;
    color: #fff;
    &:hover:not(:disabled) { background: $theme-red-hover; color: #fff; }
    &:disabled { background: #ddd; }
  }
}

.time-row {
  font-size: 10px;
  color: #aaa;
  display: flex;
  gap: 2px;
}

.volume-wrap {
  position: relative;
  .volume-slider-box {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    padding: 10px 6px;
    background: #fff;
    border-radius: 6px;
    box-shadow: $shadow-md;
    z-index: 10;
  }
}

.player-right {
  flex-shrink: 0;
}

// 播放列表面板
.playlist-panel {
  position: absolute;
  bottom: calc($player-height + 3px);
  right: 20px;
  width: 340px;
  max-height: 380px;
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: $font-md;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;

  .btn-clear {
    font-size: $font-sm;
    color: $text-muted;
    &:hover { color: $theme-red; }
  }
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  max-height: 330px;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.1s;

  &:hover { background: #f5f5f5; }
  &.active { background: rgba($theme-red, 0.04); color: $theme-red; }

  .item-status { width: 18px; text-align: center; font-size: $font-sm; color: $text-muted; flex-shrink: 0; }
  .playing { color: $theme-red; }
  .item-meta { flex: 1; min-width: 0; display: flex; overflow: hidden; }
  .item-name {
    font-size: $font-sm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .item-artist {
    font-size: $font-sm;
    color: $text-muted;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .item-remove {
    color: $text-muted;
    opacity: 0;
    padding: 2px;
    &:hover { color: $theme-red; }
  }
  &:hover .item-remove { opacity: 1; }
}

.panel-empty {
  padding: 40px;
  text-align: center;
  color: $text-muted;
  font-size: $font-sm;
}

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(8px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
