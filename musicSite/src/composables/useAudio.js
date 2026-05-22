import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'

export function useAudio() {
  const playerStore = usePlayerStore()
  const audioElement = ref(null)
  const currentTimeDisplay = ref('0:00')
  const durationDisplay = ref('0:00')
  const progressPercent = ref(0)

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function initAudio() {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.src = ''
    }
    audioElement.value = new Audio()
    audioElement.value.volume = playerStore.volume

    audioElement.value.addEventListener('timeupdate', onTimeUpdate)
    audioElement.value.addEventListener('loadedmetadata', onLoaded)
    audioElement.value.addEventListener('ended', onEnded)
    audioElement.value.addEventListener('error', onError)
  }

  function onTimeUpdate() {
    if (audioElement.value) {
      playerStore.setCurrentTime(audioElement.value.currentTime)
      currentTimeDisplay.value = formatTime(audioElement.value.currentTime)
      if (playerStore.duration > 0) {
        progressPercent.value = (audioElement.value.currentTime / playerStore.duration) * 100
      }
    }
  }

  function onLoaded() {
    if (audioElement.value) {
      playerStore.setDuration(audioElement.value.duration)
      durationDisplay.value = formatTime(audioElement.value.duration)
    }
  }

  function onEnded() {
    if (playerStore.playMode === 'single') {
      // 单曲循环
      if (audioElement.value) {
        audioElement.value.currentTime = 0
        audioElement.value.play()
      }
    } else {
      playerStore.next()
    }
  }

  function onError() {
    console.warn('音频加载失败')
    playerStore.next()
  }

  // 监听当前歌曲变化
  watch(
    () => playerStore.currentSong,
    (song) => {
      if (song && audioElement.value) {
        audioElement.value.src = song.url || ''
        audioElement.value.play().catch(() => {
          // 浏览器可能阻止自动播放，用静默方式无视错误
        })
      }
    }
  )

  // 监听播放/暂停状态
  watch(
    () => playerStore.isPlaying,
    (playing) => {
      if (!audioElement.value) return
      if (playing) {
        if (audioElement.value.src) {
          audioElement.value.play().catch(() => {})
        }
      } else {
        audioElement.value.pause()
      }
    }
  )

  // 监听音量变化
  watch(
    () => playerStore.volume,
    (vol) => {
      if (audioElement.value) {
        audioElement.value.volume = vol
      }
    }
  )

  // 拖拽进度条
  function seekTo(percent) {
    if (audioElement.value && playerStore.duration > 0) {
      const newTime = (percent / 100) * playerStore.duration
      audioElement.value.currentTime = newTime
      playerStore.setCurrentTime(newTime)
    }
  }

  onMounted(() => {
    initAudio()
  })

  onUnmounted(() => {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.removeEventListener('timeupdate', onTimeUpdate)
      audioElement.value.removeEventListener('loadedmetadata', onLoaded)
      audioElement.value.removeEventListener('ended', onEnded)
      audioElement.value.removeEventListener('error', onError)
      audioElement.value = null
    }
  })

  return {
    currentTimeDisplay,
    durationDisplay,
    progressPercent,
    seekTo,
    formatTime
  }
}
