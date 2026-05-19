import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// ===== RSS 源 =====

export function listSources() {
  return api.get('/sources')
}

export function createSource(data) {
  return api.post('/sources', data)
}

export function updateSource(id, data) {
  return api.put(`/sources/${id}`, data)
}

export function deleteSource(id) {
  return api.delete(`/sources/${id}`)
}

export function getRecommendations() {
  return api.get('/sources/recommendations')
}

export function bulkAddSources(urls) {
  return api.post('/sources/bulk-add', { urls })
}

// ===== 抓取 =====

export function triggerFetch() {
  return api.post('/fetch')
}

export function getTaskStatus(taskId) {
  return api.get(`/task/${taskId}`)
}

// ===== 日报 =====

export function getLatestReport() {
  return api.get('/latest')
}

export function getReports() {
  return api.get('/reports')
}

export function getReportDownloadUrl(id) {
  return `/api/report/${id}/download`
}

// ===== AI 配置 =====

export function setOpenAIKey(data) {
  return api.post('/set-openai-key', data)
}

export function checkOpenAIKey() {
  return api.get('/check-openai-key')
}
