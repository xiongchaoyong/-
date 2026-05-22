import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // 播放列表
  const playlist = ref([])
  const currentIndex = ref(-1)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.7)
  const playMode = ref('list') // list | random | single

  // 计算属性
  const currentSong = computed(() => {
    if (currentIndex.value >= 0 && playlist.value.length > 0) {
      return playlist.value[currentIndex.value]
    }
    return null
  })

  const hasSong = computed(() => currentSong.value !== null)

  const playlistLength = computed(() => playlist.value.length)

  // 播放模式图标
  const playModeIcon = computed(() => {
    const icons = { list: 'Notebook', random: 'Switch', single: 'SemiSelect' }
    return icons[playMode.value]
  })

  // Actions
  function setPlaylist(songs, startIndex = 0) {
    playlist.value = songs
    currentIndex.value = startIndex
    isPlaying.value = true
  }

  function addToPlaylist(song) {
    playlist.value.push(song)
    if (currentIndex.value === -1) {
      currentIndex.value = 0
    }
  }

  function play(index) {
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
      isPlaying.value = true
    }
  }

  function togglePlay() {
    if (hasSong.value) {
      isPlaying.value = !isPlaying.value
    }
  }

  function next() {
    if (playlist.value.length === 0) return
    if (playMode.value === 'random') {
      const randomIndex = Math.floor(Math.random() * playlist.value.length)
      currentIndex.value = randomIndex
    } else {
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    }
    isPlaying.value = true
  }

  function prev() {
    if (playlist.value.length === 0) return
    if (currentTime.value > 3) {
      // 当前进度 > 3s，从头播放
      currentTime.value = 0
    } else {
      if (playMode.value === 'random') {
        currentIndex.value = Math.floor(Math.random() * playlist.value.length)
      } else {
        currentIndex.value =
          (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
      }
    }
    isPlaying.value = true
  }

  function setVolume(vol) {
    volume.value = Math.max(0, Math.min(1, vol))
  }

  function toggleMute() {
    volume.value = volume.value > 0 ? 0 : 0.7
  }

  function switchPlayMode() {
    const modes = ['list', 'random', 'single']
    const idx = modes.indexOf(playMode.value)
    playMode.value = modes[(idx + 1) % modes.length]
  }

  function setCurrentTime(time) {
    currentTime.value = time
  }

  function setDuration(dur) {
    duration.value = dur
  }

  function removeFromPlaylist(index) {
    playlist.value.splice(index, 1)
    if (playlist.value.length === 0) {
      currentIndex.value = -1
      isPlaying.value = false
    } else if (index <= currentIndex.value) {
      currentIndex.value = Math.min(currentIndex.value, playlist.value.length - 1)
    }
  }

  function clearPlaylist() {
    playlist.value = []
    currentIndex.value = -1
    isPlaying.value = false
  }

  return {
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    playMode,
    currentSong,
    hasSong,
    playlistLength,
    playModeIcon,
    setPlaylist,
    addToPlaylist,
    play,
    togglePlay,
    next,
    prev,
    setVolume,
    toggleMute,
    switchPlayMode,
    setCurrentTime,
    setDuration,
    removeFromPlaylist,
    clearPlaylist
  }
})
