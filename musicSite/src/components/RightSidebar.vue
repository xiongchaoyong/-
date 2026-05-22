<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const hotTopics = [
  { name: '华语新歌榜', count: '1258万' },
  { name: '摇滚力量', count: '654万' },
  { name: '电子狂潮', count: '1120万' },
  { name: '经典金曲', count: '1580万' },
  { name: '治愈纯音', count: '896万' }
]

function goLogin() {
  router.push('/login')
}
</script>

<template>
  <aside class="right-sidebar">
    <!-- 登录卡片 (未登录时显示) -->
    <div class="login-card" v-if="!userStore.isLoggedIn">
      <p class="login-card-title">登录音悦台</p>
      <p class="login-card-desc">发现好音乐，从这里开始</p>
      <button class="btn-right-login" @click="goLogin">立即登录</button>
    </div>

    <!-- 热门推荐 -->
    <div class="hot-card">
      <div class="hot-header">
        <h4>热门推荐</h4>
        <span class="hot-more">&gt;</span>
      </div>
      <div class="hot-list">
        <div
          v-for="(item, idx) in hotTopics"
          :key="item.name"
          class="hot-item"
        >
          <span class="hot-index" :class="{ top: idx < 3 }">{{ idx + 1 }}</span>
          <div class="hot-info">
            <span class="hot-name">{{ item.name }}</span>
            <span class="hot-count">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.right-sidebar {
  width: $sidebar-right;
  flex-shrink: 0;
}

.login-card {
  background: #fff;
  border-radius: $radius-md;
  padding: 20px;
  text-align: center;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-md;

  .login-card-title {
    font-size: $font-xl;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }

  .login-card-desc {
    font-size: $font-sm;
    color: $text-muted;
    margin-bottom: 16px;
  }

  .btn-right-login {
    width: 100%;
    padding: 10px 0;
    border-radius: 20px;
    background: $theme-red;
    color: $text-white;
    font-size: $font-lg;
    transition: background 0.2s;

    &:hover {
      background: $theme-red-hover;
    }
  }
}

.hot-card {
  background: #fff;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.hot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;

  h4 {
    font-size: $font-lg;
    font-weight: 600;
    color: $text-primary;
  }

  .hot-more {
    font-size: $font-sm;
    color: $text-muted;
    cursor: pointer;
  }
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f8f8f8;
  }

  .hot-index {
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: $font-sm;
    color: $text-muted;
    background: #f0f0f0;
    border-radius: $radius-sm;
    margin-right: 10px;
    flex-shrink: 0;

    &.top {
      background: $theme-red;
      color: $text-white;
      font-weight: 600;
    }
  }

  .hot-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .hot-name {
    font-size: $font-md;
    color: $text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hot-count {
    font-size: $font-xs;
    color: $text-muted;
    margin-top: 2px;
  }
}
</style>
