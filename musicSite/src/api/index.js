import axios from 'axios'
import { mockBanners } from './mock/banner'
import { mockPlaylists } from './mock/playlist'
import { mockSongs, mockLatestSongs } from './mock/song'
import { findUser, addUser } from './mock/user'

// 是否使用 Mock 数据（可通过环境变量控制）
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== undefined && res.code !== 200) {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// Mock 响应工具
function mockResponse(data, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data })
    }, delay)
  })
}

function mockError(message, delay = 300) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, delay)
  })
}

// Mock API 处理
const mockHandlers = {
  // Banner
  'GET /banner': () => mockResponse(mockBanners),

  // 推荐歌单
  'GET /playlist/recommend': () => mockResponse(mockPlaylists),

  // 歌曲列表
  'GET /songs': () => mockResponse(mockSongs),

  // 最新歌曲
  'GET /songs/latest': () => mockResponse(mockLatestSongs),

  // 登录
  'POST /user/login': (config) => {
    const body = JSON.parse(config.data || '{}')
    const user = findUser(body.email)
    if (!user) return mockError('用户不存在，请先注册')
    if (user.password !== body.password) return mockError('密码错误，请重试')
    return mockResponse({
      token: `mock_token_${user.id}_${Date.now()}`,
      userInfo: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        createTime: user.createTime,
        stats: user.stats || { dynamic: 0, fans: 0, follow: 0 }
      }
    })
  },

  // 注册
  'POST /user/register': (config) => {
    const body = JSON.parse(config.data || '{}')
    const existUser = findUser(body.email)
    if (existUser) return mockError('该邮箱已被注册')
    if (body.verificationCode !== '123456') return mockError('验证码错误')
    const newUser = addUser({
      username: body.email.split('@')[0],
      email: body.email,
      password: body.password
    })
    return mockResponse({ message: '注册成功', userId: newUser.id })
  },

  // 发送验证码
  'POST /user/verify-code': (config) => {
    const body = JSON.parse(config.data || '{}')
    if (!body.email) return mockError('邮箱不能为空')
    return mockResponse({ message: '验证码已发送', code: '123456' })
  },

  // 修改密码
  'POST /user/change-password': (config) => {
    const body = JSON.parse(config.data || '{}')
    if (body.oldPassword !== 'Abc123') return mockError('原密码错误')
    return mockResponse({ message: '密码修改成功' })
  }
}

// 设置 Axios Mock 拦截器
if (USE_MOCK) {
  service.interceptors.request.use(
    (config) => {
      // 完全覆盖请求，返回 mock
      return new Promise((resolve, reject) => {
        const key = `${config.method?.toUpperCase()} ${config.url}`
        const handler = mockHandlers[key]

        if (handler) {
          const response = handler(config)
          response.then((data) => {
            const mockResult = {
              data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
              ...config
            }
            resolve(mockResult)
          }).catch(reject)
        } else {
          console.warn(`未找到 Mock 处理器: ${key}`)
          resolve({
            data: mockResponse({}),
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          })
        }
      })
    },
    (error) => Promise.reject(error)
  )
}

export default service
