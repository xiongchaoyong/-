const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const { JWT_SECRET } = require('../middleware/auth')

const router = Router()

// 发送验证码（Mock：固定返回 123456）
router.post('/user/verify-code', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ code: 400, message: '邮箱不能为空' })
  }
  // Mock 验证码始终为 123456
  res.json({ code: 200, data: { message: '验证码已发送', code: '123456' } })
})

// 注册
router.post('/user/register', (req, res) => {
  const { email, password, verificationCode } = req.body

  if (!email || !password || !verificationCode) {
    return res.status(400).json({ code: 400, message: '请填写完整信息' })
  }

  if (verificationCode !== '123456') {
    return res.status(400).json({ code: 400, message: '验证码错误' })
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    return res.status(400).json({ code: 400, message: '该邮箱已被注册' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const username = email.split('@')[0]
  const result = db.prepare(`
    INSERT INTO users (username, email, password, nickname) VALUES (?, ?, ?, ?)
  `).run(username, email, hash, username)

  res.json({ code: 200, data: { message: '注册成功', userId: result.lastInsertRowid } })
})

// 登录
router.post('/user/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ code: 400, message: '请输入邮箱/用户名和密码' })
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE email = ? OR username = ?'
  ).get(email, email)

  if (!user) {
    return res.status(400).json({ code: 400, message: '用户不存在，请先注册' })
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ code: 400, message: '密码错误，请重试' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, nickname: user.nickname },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    code: 200,
    data: {
      token,
      userInfo: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        createTime: user.create_time,
        stats: {
          dynamic: user.dynamic_count,
          fans: user.fans_count,
          follow: user.follow_count
        }
      }
    }
  })
})

// 修改密码（需要登录）
router.post('/user/change-password', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '请先登录' })
  }

  let userId
  try {
    const payload = jwt.verify(authHeader.split(' ')[1], JWT_SECRET)
    userId = payload.id
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }

  const { oldPassword, newPassword } = req.body
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(400).json({ code: 400, message: '原密码错误' })
  }

  const hash = bcrypt.hashSync(newPassword, 10)
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, userId)

  res.json({ code: 200, data: { message: '密码修改成功' } })
})

module.exports = router
