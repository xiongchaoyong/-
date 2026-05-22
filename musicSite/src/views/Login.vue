<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱或用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, message: '密码长度不能少于 4 位', trigger: 'blur' }
  ]
}

const formRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  errorMessage.value = ''

  try {
    await userStore.login({
      email: loginForm.email,
      password: loginForm.password
    })
    ElMessage.success('登录成功')
    // 跳转到来源页面或首页
    const redirect = route.query.redirect || '/discover'
    router.push(redirect)
  } catch (err) {
    errorMessage.value = err.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">&#9835; 音悦台</h1>
        <p class="login-subtitle">发现好音乐，从这里开始</p>
      </div>

      <div class="login-card">
        <h2 class="card-title">登录</h2>

        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱或用户名"
              prefix-icon="Message"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 错误提示 -->
          <transition name="fade">
            <div v-if="errorMessage" class="error-message">
              <el-icon size="16"><WarningFilled /></el-icon>
              {{ errorMessage }}
            </div>
          </transition>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="btn-submit"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="link-register">立即注册</router-link>
        </div>

        <div class="demo-hint">
          <p>演示账号：test@music.com / Abc123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: calc(100vh - #{$navbar-height} - #{$player-height} - #{$spacing-md});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: $spacing-xl;

  .login-title {
    font-size: 32px;
    font-weight: 700;
    color: $theme-red;
    margin-bottom: $spacing-xs;
  }

  .login-subtitle {
    font-size: $font-md;
    color: $text-muted;
  }
}

.login-card {
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xxl;
  box-shadow: $shadow-md;

  .card-title {
    font-size: $font-xxl;
    font-weight: 600;
    margin-bottom: $spacing-lg;
    text-align: center;
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: 10px $spacing-md;
  margin-bottom: $spacing-md;
  background: #fef0f0;
  border: 1px solid #fde2e2;
  border-radius: $radius-sm;
  color: $theme-red;
  font-size: $font-sm;
}

.btn-submit {
  width: 100%;
  margin-top: $spacing-sm;
}

.login-footer {
  text-align: center;
  font-size: $font-sm;
  color: $text-muted;
  margin-top: $spacing-md;

  .link-register {
    color: $theme-red;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.demo-hint {
  text-align: center;
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $border-light;
  font-size: $font-xs;
  color: $text-muted;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
