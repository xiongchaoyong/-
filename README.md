# 华东交通大学 2023 级软件工程实训

本仓库是华东交通大学 2023 级软件工程专业实训的每日作业汇总，每天一个独立项目，循序渐进地学习 AI 辅助软件开发。

仓库地址：[git@github.com:xiongchaoyong/EJTCU-Practical-Training.git](https://github.com/xiongchaoyong/EJTCU-Practical-Training)

## 项目列表

### Day01 — RSS 聚合器

基于 AI 大模型的新闻聚合工具。自动抓取多个 RSS 源的最新文章，调用 AI 生成中文要点总结，输出 Markdown 日报。

- **后端**：Python + FastAPI + SQLite + APScheduler
- **前端**：Vue 3 + Element Plus + Vite
- **AI 服务**：兼容 OpenAI 接口（支持 OpenAI / DeepSeek 等）
- **核心流程**：RSS 抓取 → AI 摘要 → Markdown 日报生成

### Day02 — Agentic 工作流

基于 Claude Code 的 AI 辅助需求分析系统。以"基于图像特征识别的宠物领养平台"为案例，构建智能体+技能协作的需求分析工作流。

- **开发理念**：Plan → Execute 工作流，AI 从代码补全升级为协作团队
- **核心内容**：
  - Vibe Coding 核心工作流（规划先行，执行在后）
  - Agentic 数字团队（多智能体角色分工与协作）
  - 需求澄清技能（100 分评分制，≥90 分方可进入开发）
  - 产品经理智能体（需求分析 → PRD 生成）
- **输出产物**：标准化的 PRD 文档、需求澄清记录

### Day03 — 音悦台音乐网站

仿网易云音乐的全栈音乐平台。支持用户注册登录、音乐发现、在线播放等功能。

- **前端**：Vue 3 + Vite + Element Plus + Pinia
- **后端**：Express + SQLite + JWT 认证
- **核心功能**：
  - 发现音乐（Banner 轮播、热门歌单、最新歌曲）
  - 用户注册/登录（JWT Token 认证）
  - 个人中心
  - 底部音乐播放器（播放控制、音量调节）
  - 路由守卫（未登录拦截）

### Day04 — Skills 技能使用

学习 Claude Code 的 Skills 技能系统，包括技能创建、配置和使用。

- **技能创建**：使用 skill-creator 工具自定义技能
- **Vibe Coding 技能**：学习如何在开发工作流中使用技能提升效率
- **核心内容**：技能定义、触发规则、工作流集成

### Day05 — 数字团队前端与测试

AI 辅助的前端开发与自动化测试实践，构建数字团队协作模式。

- **前端开发**：AI 辅助的组件开发与页面搭建
- **自动化测试**：AI 生成测试用例与测试代码
- **团队协作**：多智能体分工协作完成前端任务
