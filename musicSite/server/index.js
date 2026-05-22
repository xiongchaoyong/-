const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const musicRoutes = require('./routes/music')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// API 路由
app.use('/api', authRoutes)
app.use('/api', musicRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 200, data: { status: 'ok', timestamp: new Date().toISOString() } })
})

// 在生产模式下托管前端静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')))
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`[Server] 后端服务已启动: http://localhost:${PORT}`)
  console.log(`[Server] API 地址: http://localhost:${PORT}/api`)
})
