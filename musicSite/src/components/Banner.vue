<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getBanners } from '@/api/modules/music'

const banners = ref([])
const currentIndex = ref(0)
let timer = null

function loadBanners() {
  getBanners().then(res => {
    banners.value = res.data
  })
}

function next() {
  if (banners.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % banners.value.length
}

function prev() {
  if (banners.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length
}

function goTo(index) {
  currentIndex.value = index
}

function startAutoPlay() {
  stopAutoPlay()
  timer = setInterval(next, 4000)
}

function stopAutoPlay() {
  if (timer) { clearInterval(timer); timer = null }
}

onMounted(() => { loadBanners(); startAutoPlay() })
onUnmounted(() => { stopAutoPlay() })
</script>

<template>
  <div
    class="banner-container"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <div class="banner-viewport">
      <div
        v-for="(banner, index) in banners"
        :key="banner.id"
        class="banner-slide"
        :class="{ active: index === currentIndex }"
        :style="{ backgroundColor: banner.bgColor }"
        v-show="index === currentIndex"
      >
        <div class="banner-inner">
          <span class="banner-tag">&#9835;</span>
          <div class="banner-text">
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- 左右箭头 -->
      <button class="banner-arrow left" @click="prev">&#10094;</button>
      <button class="banner-arrow right" @click="next">&#10095;</button>
    </div>

    <!-- 指示器 -->
    <div class="banner-dots">
      <span
        v-for="(b, i) in banners"
        :key="b.id"
        class="dot"
        :class="{ active: i === currentIndex }"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-container {
  width: 100%;
  margin-bottom: $spacing-lg;
}

.banner-viewport {
  position: relative;
  width: 100%;
  height: 183px;
  border-radius: $radius-md;
  overflow: hidden;
  cursor: pointer;

  &:hover .banner-arrow {
    opacity: 1;
  }
}

.banner-slide {
  position: absolute;
  inset: 0;
  transition: opacity 0.4s ease;
}

.banner-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 60px;
  gap: 20px;

  .banner-tag {
    font-size: 56px;
    color: rgba(255,255,255,0.8);
    flex-shrink: 0;
  }

  .banner-text {
    h2 {
      font-size: 22px;
      font-weight: 700;
      color: $text-white;
      text-shadow: 0 1px 4px rgba(0,0,0,0.3);
      margin-bottom: 6px;
    }

    p {
      font-size: $font-md;
      color: rgba(255,255,255,0.85);
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
  }
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  color: $text-primary;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
  cursor: pointer;

  &:hover {
    background: #fff;
  }

  &.left { left: 8px; }
  &.right { right: 8px; }
}

.banner-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #d8d8d8;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background: $theme-red;
      width: 20px;
      border-radius: 10px;
    }
  }
}
</style>
