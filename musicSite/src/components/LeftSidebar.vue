<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const stats = computed(() => {
  return userStore.userInfo?.stats || { dynamic: 0, fans: 0, follow: 0 }
})

const menuItems = [
  { icon: '&#9835;', label: '创建的歌单', count: 8 },
  { icon: '&#9829;', label: '收藏的歌单', count: 12 }
]

function goLogin() {
  router.push('/login')
}
</script>

<template>
  <aside class="left-sidebar">
    <!-- 用户卡片 -->
    <div class="user-card">
      <template v-if="userStore.isLoggedIn">
        <div class="user-card-top">
          <el-avatar :size="60" icon="UserFilled" />
        </div>
        <div class="user-card-info">
          <h4 class="user-nickname">{{ userStore.userInfo?.nickname }}</h4>
          <div class="user-stats">
            <span class="stat"><b>{{ stats.dynamic }}</b> 动态</span>
            <span class="stat"><b>{{ stats.fans }}</b> 粉丝</span>
            <span class="stat"><b>{{ stats.follow }}</b> 关注</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="user-card-top guest">
          <span class="guest-icon">&#9835;</span>
          <p class="guest-text">登录后享受更多音乐服务</p>
          <button class="btn-user-login" @click="goLogin">立即登录</button>
        </div>
      </template>
    </div>

    <!-- 歌单导航 -->
    <div class="sidebar-menu">
      <div
        v-for="item in menuItems"
        :key="item.label"
        class="menu-item"
      >
        <span class="menu-icon" v-html="item.icon"></span>
        <span class="menu-label">{{ item.label }}</span>
        <span class="menu-count">{{ item.count }}</span>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.left-sidebar {
  width: $sidebar-left;
  flex-shrink: 0;
  background: transparent;
}

.user-card {
  background: #fff;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-md;
}

.user-card-top {
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8f8f8 0%, #fff 100%);

  &.guest {
    padding: 28px 20px;
    background: #fff;

    .guest-icon {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 12px;
    }

    .guest-text {
      font-size: $font-sm;
      color: $text-muted;
      margin-bottom: 16px;
    }

    .btn-user-login {
      width: 100%;
      padding: 8px 0;
      border-radius: 20px;
      background: $theme-red;
      color: $text-white;
      font-size: $font-md;
      transition: background 0.2s;

      &:hover {
        background: $theme-red-hover;
      }
    }
  }
}

.user-card-info {
  padding: 0 20px 20px;
  text-align: center;

  .user-nickname {
    font-size: $font-lg;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 10px;
  }

  .user-stats {
    display: flex;
    justify-content: center;
    gap: 14px;

    .stat {
      font-size: $font-xs;
      color: $text-muted;

      b {
        color: $text-secondary;
        font-weight: 600;
        margin-right: 3px;
      }
    }
  }
}

.sidebar-menu {
  background: #fff;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: $font-md;
  color: $text-secondary;

  &:hover {
    background: #f5f5f5;
  }

  .menu-icon {
    width: 24px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .menu-label {
    flex: 1;
  }

  .menu-count {
    color: $text-muted;
    font-size: $font-xs;
  }
}
</style>
