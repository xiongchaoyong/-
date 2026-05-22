<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const searchKeyword = ref('')

const navItems = [
  { path: '/discover', label: '发现音乐' },
  { path: '/user', label: '我的音乐' },
  { path: '/discover', label: '关注' },
  { path: '/discover', label: '商城' },
  { path: '/discover', label: '音乐人' }
]

function isActive(path) {
  if (path === '/discover') return route.path === '/discover'
  if (path === '/user') return route.path === '/user'
  return false
}

function handleSearch() {
  // placeholder
}
</script>

<template>
  <header class="app-navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/discover" class="navbar-logo">
        <svg class="logo-svg" viewBox="0 0 28 28" width="28" height="28">
          <circle cx="14" cy="14" r="13" fill="none" stroke="#C62F2F" stroke-width="2"/>
          <text x="14" y="20" text-anchor="middle" fill="#C62F2F" font-size="16" font-weight="bold">&#9835;</text>
        </svg>
        <span class="logo-text">音悦台</span>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="navbar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- 右侧区域 -->
      <div class="navbar-right">
        <!-- 搜索框 -->
        <div class="navbar-search">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <span class="search-icon">&#128269;</span>
        </div>

        <!-- 创作者中心 -->
        <button class="btn-creator">创作者中心</button>

        <!-- 用户区域 -->
        <div class="navbar-user">
          <template v-if="userStore.isLoggedIn">
            <div class="user-avatar-wrap" @click="router.push('/user')">
              <el-avatar :size="28" icon="UserFilled" />
              <span class="user-name">{{ userStore.userInfo?.nickname }}</span>
              <span class="arrow-down">&#9662;</span>
            </div>
          </template>
          <template v-else>
            <button class="btn-login" @click="router.push('/login')">登录</button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: $navbar-height;
  background: $nav-bg;
  z-index: 1000;
  min-width: 1024px;
}

.navbar-inner {
  max-width: $content-outer;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

// Logo
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 40px;
  flex-shrink: 0;

  .logo-svg {
    display: block;
  }

  .logo-text {
    color: $text-white;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1px;
  }
}

// 导航
.navbar-nav {
  display: flex;
  height: 100%;
  gap: 0;

  .nav-item {
    display: flex;
    align-items: center;
    padding: 0 18px;
    color: $text-nav;
    font-size: $font-lg;
    position: relative;
    transition: color 0.2s;
    white-space: nowrap;

    &:hover {
      color: $text-white;
    }

    &.active {
      color: $text-white;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 3px;
        background: $theme-red;
        border-radius: 2px 2px 0 0;
      }
    }
  }
}

// 右侧
.navbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
  flex-shrink: 0;
}

.navbar-search {
  position: relative;
  width: 160px;

  .search-input {
    width: 100%;
    height: 28px;
    border-radius: 15px;
    border: none;
    background: #3a3a3a;
    color: #ddd;
    font-size: $font-sm;
    padding: 0 30px 0 12px;
    line-height: 28px;

    &::placeholder {
      color: #888;
    }
  }

  .search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    opacity: 0.5;
    pointer-events: none;
  }
}

.btn-creator {
  color: $text-nav;
  font-size: $font-sm;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #4a4a4a;
  white-space: nowrap;

  &:hover {
    color: $text-white;
    border-color: #666;
  }
}

.navbar-user {
  display: flex;
  align-items: center;
}

.user-avatar-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 14px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.08);
  }

  .user-name {
    color: $text-nav;
    font-size: $font-sm;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .arrow-down {
    color: $text-nav;
    font-size: 10px;
    margin-left: -2px;
  }
}

.btn-login {
  color: $text-white;
  font-size: $font-sm;
  padding: 5px 20px;
  border-radius: 20px;
  border: 1px solid $theme-red;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: rgba($theme-red, 0.2);
  }
}
</style>
