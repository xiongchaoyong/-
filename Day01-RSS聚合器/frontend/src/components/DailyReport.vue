<template>
  <div class="report-container">
    <div v-if="errorMsg" class="empty-state">
      <el-empty :description="errorMsg" />
      <el-button type="primary" @click="refresh">刷新日报</el-button>
    </div>

    <div v-else-if="!report" class="empty-state">
      <el-empty description="暂无日报，请先执行抓取任务" />
      <el-button type="primary" @click="refresh">刷新日报</el-button>
    </div>

    <div v-else class="report-content">
      <!-- 日报操作栏 -->
      <div class="report-header">
        <div class="report-meta">
          <span>生成时间：{{ formatTime(report.generated_at) }}</span>
          <el-tag size="small">{{ report.article_count }} 篇文章</el-tag>
          <el-tag size="small" type="info">{{ report.source_count }} 个源</el-tag>
          <el-tag size="small" :type="report.trigger_source === 'scheduled' ? 'warning' : 'success'">
            {{ report.trigger_source === 'scheduled' ? '定时任务' : '手动触发' }}
          </el-tag>
        </div>
        <div class="report-actions">
          <el-button-group>
            <el-button :type="viewMode === 'render' ? 'primary' : 'default'" size="small" @click="viewMode = 'render'">
              渲染
            </el-button>
            <el-button :type="viewMode === 'source' ? 'primary' : 'default'" size="small" @click="viewMode = 'source'">
              源码
            </el-button>
          </el-button-group>
          <el-button size="small" @click="download">
            <el-icon><Download /></el-icon>
            下载 .md
          </el-button>
        </div>
      </div>

      <!-- 渲染模式 -->
      <div v-if="viewMode === 'render'" class="markdown-body" v-html="renderedMarkdown" />

      <!-- 源码模式 -->
      <pre v-else class="source-code">{{ report.markdown_content }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import { Download } from '@element-plus/icons-vue'
import { getLatestReport, getReportDownloadUrl } from '../api/index.js'

const report = ref(null)
const errorMsg = ref('')
const viewMode = ref('render')

const renderedMarkdown = computed(() => {
  if (!report.value?.markdown_content) return ''
  return marked(report.value.markdown_content)
})

function formatTime(t) {
  if (!t) return '-'
  const d = new Date(t)
  return d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

async function refresh() {
  errorMsg.value = ''
  try {
    const res = await getLatestReport()
    report.value = res.data
  } catch (e) {
    report.value = null
    if (e.response?.status === 404) {
      errorMsg.value = '尚无日报，请先执行抓取任务'
    } else {
      errorMsg.value = '加载日报失败'
    }
  }
}

function download() {
  if (!report.value) return
  const url = getReportDownloadUrl(report.value.id)
  window.open(url, '_blank')
}

defineExpose({ refresh })

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.report-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 12px;
}

.report-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #606266;
  font-size: 14px;
}

.report-actions {
  display: flex;
  gap: 8px;
}

.markdown-body {
  padding: 24px;
  line-height: 1.8;
}

.markdown-body :deep(h2) {
  font-size: 20px;
  margin: 24px 0 12px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 6px;
}

.markdown-body :deep(h3) {
  font-size: 16px;
  margin: 16px 0 8px;
  color: #606266;
}

.markdown-body :deep(p) {
  margin: 8px 0;
  color: #606266;
}

.markdown-body :deep(a) {
  color: #409eff;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 20px 0;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid #409eff;
  padding: 4px 12px;
  margin: 12px 0;
  background: #f0f9ff;
  color: #606266;
}

.source-code {
  padding: 24px;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
  background: #fafafa;
}
</style>
