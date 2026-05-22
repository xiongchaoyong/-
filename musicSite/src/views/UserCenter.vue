<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { changePasswordAPI } from '@/api/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
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
  confirmNewPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const passwordFormRef = ref(null)
const changingPassword = ref(false)

async function handleChangePassword() {
  if (!passwordFormRef.value) return

  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) return

  changingPassword.value = true
  try {
    await changePasswordAPI({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')
    // 重置表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmNewPassword = ''
    passwordFormRef.value.resetFields()
  } catch (err) {
    ElMessage.error(err.message || '修改失败')
  } finally {
    changingPassword.value = false
  }
}

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/discover')
  }).catch(() => {})
}

function formatDate(dateStr) {
  if (!dateStr) return '--'
  return dateStr
}
</script>

<template>
  <div class="user-page" v-if="userStore.isLoggedIn">
    <div class="page-container">
      <!-- 用户信息卡片 -->
      <section class="section">
        <h3 class="section-title">个人信息</h3>
        <div class="user-card">
          <div class="user-avatar">
            <el-avatar :size="72" icon="UserFilled" />
          </div>
          <div class="user-details">
            <h2 class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</h2>
            <p class="user-email">
              <el-icon size="16"><Message /></el-icon>
              {{ userStore.userInfo?.email }}
            </p>
            <p class="user-time">
              <el-icon size="16"><Calendar /></el-icon>
              注册时间：{{ formatDate(userStore.userInfo?.createTime) }}
            </p>
          </div>
        </div>
      </section>

      <!-- 修改密码 -->
      <section class="section">
        <h3 class="section-title">修改密码</h3>
        <div class="password-card">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-position="top"
            @submit.prevent="handleChangePassword"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入原密码"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="至少 6 位，包含字母和数字"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmNewPassword">
              <el-input
                v-model="passwordForm.confirmNewPassword"
                type="password"
                placeholder="请再次输入新密码"
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :loading="changingPassword"
                @click="handleChangePassword"
              >
                确认修改
              </el-button>
              <el-button @click="passwordFormRef?.resetFields()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>

      <!-- 退出登录 -->
      <section class="section">
        <button class="btn-logout-bottom" @click="handleLogout">
          <el-icon size="18"><SwitchButton /></el-icon>
          退出登录
        </button>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  max-width: $content-outer;
  margin: 0 auto;
  padding: $spacing-lg;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.section {
  .section-title {
    font-size: $font-xl;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 2px solid $theme-red;
    display: inline-block;
  }
}

.user-card {
  background: #fff;
  border-radius: $radius-md;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.user-details {
  .user-name {
    font-size: $font-xxl;
    font-weight: 600;
    margin-bottom: $spacing-sm;
    color: $text-primary;
  }

  .user-email,
  .user-time {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-md;
    color: $text-secondary;
    margin-bottom: 4px;
  }
}

.password-card {
  background: #fff;
  border-radius: $radius-md;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
  max-width: 420px;
}

.btn-logout-bottom {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: 10px 24px;
  border: 1px solid #e1e1e1;
  border-radius: $radius-sm;
  color: $text-secondary;
  font-size: $font-md;
  transition: all 0.2s;

  &:hover {
    color: $theme-red;
    border-color: $theme-red;
    background: rgba($theme-red, 0.04);
  }
}
</style>
