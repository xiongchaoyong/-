<script setup>
import { reactive, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { sendVerifyCodeAPI } from '@/api/modules/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const registerForm = reactive({
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  verifyCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
          callback(new Error('密码需包含字母和数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const formRef = ref(null)
const loading = ref(false)
const codeSending = ref(false)
const codeCountdown = ref(0)
const errorMessage = ref('')

const countdownText = computed(() => {
  return codeCountdown.value > 0 ? `${codeCountdown.value}s 后重试` : '发送验证码'
})

let countdownTimer = null

function startCountdown() {
  codeCountdown.value = 60
  countdownTimer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

async function handleSendCode() {
  if (!registerForm.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }

  codeSending.value = true
  try {
    await sendVerifyCodeAPI(registerForm.email)
    ElMessage.success('验证码已发送，请查看邮箱（Mock 验证码：123456）')
    startCountdown()
  } catch (err) {
    ElMessage.error(err.message || '发送失败')
  } finally {
    codeSending.value = false
  }
}

// 密码强度
const passwordStrength = computed(() => {
  const pwd = registerForm.password
  if (!pwd) return { level: 0, text: '', color: '' }
  if (pwd.length < 6) return { level: 1, text: '弱', color: '#C62F2F' }
  const hasLetter = /[a-zA-Z]/.test(pwd)
  const hasNumber = /\d/.test(pwd)
  const hasSpecial = /[^a-zA-Z\d]/.test(pwd)
  if (hasLetter && hasNumber && hasSpecial && pwd.length >= 8) {
    return { level: 3, text: '强', color: '#67C23A' }
  }
  if (hasLetter && hasNumber) {
    return { level: 2, text: '中', color: '#E6A23C' }
  }
  return { level: 1, text: '弱', color: '#C62F2F' }
})

async function handleRegister() {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  errorMessage.value = ''

  try {
    await userStore.register({
      email: registerForm.email,
      verificationCode: registerForm.verifyCode,
      password: registerForm.password
    })
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="register-title">&#9835; 音悦台</h1>
        <p class="register-subtitle">创建你的音乐账号</p>
      </div>

      <div class="register-card">
        <h2 class="card-title">注册</h2>

        <el-form
          ref="formRef"
          :model="registerForm"
          :rules="rules"
          label-position="top"
          @submit.prevent="handleRegister"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              prefix-icon="Message"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item label="验证码" prop="verifyCode">
            <div class="verify-code-row">
              <el-input
                v-model="registerForm.verifyCode"
                placeholder="请输入验证码"
                size="large"
                maxlength="6"
                class="verify-input"
              />
              <el-button
                size="large"
                :disabled="codeCountdown > 0"
                :loading="codeSending"
                class="btn-send-code"
                @click="handleSendCode"
              >
                {{ countdownText }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="至少 6 位，包含字母和数字"
              prefix-icon="Lock"
              size="large"
              show-password
            />
            <!-- 密码强度条 -->
            <div v-if="registerForm.password" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :style="{
                    width: (passwordStrength.level / 3) * 100 + '%',
                    backgroundColor: passwordStrength.color
                  }"
                />
              </div>
              <span class="strength-text" :style="{ color: passwordStrength.color }">
                {{ passwordStrength.text }}
              </span>
            </div>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleRegister"
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
              @click="handleRegister"
            >
              注 册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="link-login">去登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-page {
  min-height: calc(100vh - #{$navbar-height} - #{$player-height} - #{$spacing-md});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.register-container {
  width: 100%;
  max-width: 420px;
}

.register-header {
  text-align: center;
  margin-bottom: $spacing-xl;

  .register-title {
    font-size: 32px;
    font-weight: 700;
    color: $theme-red;
    margin-bottom: $spacing-xs;
  }

  .register-subtitle {
    font-size: $font-md;
    color: $text-muted;
  }
}

.register-card {
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl $spacing-xxl;
  box-shadow: $shadow-md;

  .card-title {
    font-size: $font-xxl;
    font-weight: 600;
    margin-bottom: $spacing-lg;
    text-align: center;
  }
}

.verify-code-row {
  display: flex;
  gap: $spacing-sm;

  .verify-input {
    flex: 1;
  }

  .btn-send-code {
    flex-shrink: 0;
    min-width: 110px;
    border-color: $theme-red;
    color: $theme-red;

    &:hover:not(:disabled) {
      background: rgba($theme-red, 0.06);
    }
  }
}

.password-strength {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-xs;

  .strength-bar {
    flex: 1;
    height: 4px;
    background: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;

    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: all 0.3s;
    }
  }

  .strength-text {
    font-size: $font-xs;
    flex-shrink: 0;
    min-width: 24px;
    text-align: right;
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

.register-footer {
  text-align: center;
  font-size: $font-sm;
  color: $text-muted;
  margin-top: $spacing-md;

  .link-login {
    color: $theme-red;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
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
