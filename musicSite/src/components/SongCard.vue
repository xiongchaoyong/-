<script setup>
import { usePlayerStore } from '@/stores/player'
import { ElMessage } from 'element-plus'

const props = defineProps({
  song: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const playerStore = usePlayerStore()

function formatDuration(seconds) {
  if (!seconds) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function handlePlay() {
  playerStore.addToPlaylist(props.song)
  playerStore.play(playerStore.playlist.length - 1)
  ElMessage.success(`正在播放: ${props.song.name}`)
}
</script>

<template>
  <div class="song-card">
    <span class="col-index">{{ String(index).padStart(2, '0') }}</span>
    <div class="col-title">
      <span class="song-name">{{ song.name }}</span>
      <span v-if="song.isNew" class="new-tag">NEW</span>
    </div>
    <span class="col-artist">{{ song.artist }}</span>
    <span class="col-album">{{ song.album }}</span>
    <span class="col-duration">{{ formatDuration(song.duration) }}</span>
    <button class="col-play" @click.stop="handlePlay">
      <el-icon size="14"><VideoPlay /></el-icon>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.song-card {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 10px;
  font-size: $font-sm;
  transition: background 0.15s;

  &:nth-child(odd)  { background: #fafafa; }
  &:nth-child(even) { background: #fff; }

  &:hover {
    background: #f0f0f0;

    .col-index { color: $theme-red; }
    .col-play { opacity: 1; }
  }
}

.col-index {
  width: 36px;
  text-align: center;
  color: $text-muted;
  flex-shrink: 0;
  transition: color 0.2s;
}

.col-title {
  flex: 3;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;

  .song-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $text-primary;
  }

  .new-tag {
    font-size: 10px;
    padding: 0 3px;
    background: $theme-red;
    color: $text-white;
    border-radius: 2px;
    flex-shrink: 0;
  }
}

.col-artist {
  flex: 2;
  color: $text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-album {
  flex: 2;
  color: $text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-duration {
  width: 44px;
  text-align: right;
  color: $text-muted;
  flex-shrink: 0;
}

.col-play {
  width: 28px;
  display: flex;
  justify-content: center;
  color: $text-muted;
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { color: $theme-red; }
}
</style>
