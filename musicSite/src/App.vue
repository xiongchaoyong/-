<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import AppPlayer from '@/components/AppPlayer.vue'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

const userStore = useUserStore()
onMounted(() => { userStore.checkLogin() })
</script>

<template>
  <div class="app-wrapper">
    <AppNavbar />
    <div class="app-body">
      <router-view />
    </div>
    <AppPlayer />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $bg-page;
}

.app-body {
  flex: 1;
  padding-top: $navbar-height;
  padding-bottom: $player-height; // player is fixed, so just pad to avoid overlap
}
</style>
