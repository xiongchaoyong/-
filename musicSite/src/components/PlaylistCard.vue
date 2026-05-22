<script setup>
import { computed } from 'vue'

const props = defineProps({
  playlist: { type: Object, required: true }
})

const emit = defineEmits(['click'])

const playCountText = computed(() => {
  const c = props.playlist.playCount
  if (c >= 100000000) return `${(c / 100000000).toFixed(1)}亿`
  if (c >= 10000) return `${(c / 10000).toFixed(0)}万`
  return String(c)
})
</script>

<template>
  <div class="playlist-card" @click="emit('click', playlist)">
    <!-- 封面 -->
    <div class="card-cover" :style="{ backgroundColor: playlist.coverBg }">
      <div class="cover-play-count">
        <span class="play-icon">▶</span>
        <span>{{ playCountText }}</span>
      </div>
      <div class="cover-hover-mask">
        <span class="play-btn">▶</span>
      </div>
    </div>
    <!-- 标题 -->
    <p class="card-title">{{ playlist.name }}</p>
  </div>
</template>

<style lang="scss" scoped>
.playlist-card {
  cursor: pointer;
  position: relative;
}

.card-cover {
  width: 100%;
  padding-bottom: 100%;
  border-radius: $radius-sm;
  position: relative;
  overflow: hidden;

  .cover-play-count {
    position: absolute;
    top: 4px;
    right: 6px;
    color: #fff;
    font-size: $font-xs;
    display: flex;
    align-items: center;
    gap: 3px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    z-index: 1;
  }

  .cover-hover-mask {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;

    .play-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #fff;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
  }
}

.playlist-card:hover .cover-hover-mask {
  opacity: 1;
}

.card-title {
  font-size: $font-sm;
  color: $text-primary;
  line-height: 1.4;
  margin-top: 6px;
  padding: 0 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
</style>
