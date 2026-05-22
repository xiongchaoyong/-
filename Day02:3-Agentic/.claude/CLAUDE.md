# 项目宪章

## 项目概述

基于图像特征识别的宠物领养平台 — 通过图像特征识别技术帮助用户快速找到合眼缘的宠物，打造"领养+日记+电商"一站式服务生态。

## 技术栈

- 前端：Vue 3 + Element Plus + Vite
- 后端：待定（推荐 Node.js / Python FastAPI）
- 数据库：待定（推荐 PostgreSQL / MySQL）
- 图像识别：待定（推荐 TensorFlow / PyTorch 预训练模型）

## 开发规范

### Plan → Execute 工作流

- 新功能、架构调整、多文件改动、重构：**必须先用 Plan 模式设计方案**
- 修小 bug、改单行代码、加日志：可直接执行
- 高风险操作（删除文件、修改配置、数据库操作）必须人工确认

### 代码风格

- 使用 ESLint + Prettier 保持代码风格统一
- 组件命名：PascalCase（如 PetCard.vue）
- 文件命名：kebab-case（如 pet-service.js）
- 变量/函数命名：camelCase
- 常量命名：UPPER_SNAKE_CASE

### Git 规范

- 分支命名：feature/<功能名>、fix/<问题描述>、refactor/<模块名>
- 提交信息格式：<type>: <简短描述>
  - feat: 新功能
  - fix: 修复bug
  - refactor: 重构
  - docs: 文档
  - style: 样式调整
  - chore: 杂项

## 项目结构

```
├── .claude/          # AI配置（自动加载）
│   ├── CLAUDE.md     # 项目宪章
│   └── skills/       # 技能定义
│       └── requirements-clarity/
│           └── SKILL.md
├── myWorkFlow/       # 工作流模块
│   ├── myWorkFlow/agents/       # 智能体定义
│   ├── docs/         # 文档
│   └── output/       # 输出产物
├── src/              # 前端源码
│   ├── components/   # 公共组件
│   ├── views/        # 页面
│   ├── api/          # API接口
│   ├── stores/       # 状态管理
│   └── utils/        # 工具函数
└── server/           # 后端源码
```

## 智能体配置

本项目的 AI 智能体定义在 `myWorkFlow/agents/` 目录中。当用户的任务匹配某个智能体的职责时，你必须**先读取对应的 agent 文件**，然后严格以该文件中定义的角色、职责、工作流来执行任务。

### 可用智能体

| 智能体 | 文件 | 触发条件 |
|--------|------|----------|
| 产品经理/需求分析师 | `myWorkFlow/agents/product-manager.md` | 需求分析、PRD编写、功能拆解、用户故事、需求澄清 |

### 智能体调用规则

1. 当用户提出需求分析相关任务时（如"分析这个需求"、"写PRD"、"拆解功能"），**先 Read myWorkFlow/agents/product-manager.md**，然后按其中定义的角色执行
2. 智能体中如果指定了关联的 Skill（如 requirements-clarity），必须在执行时主动调用
3. 智能体文件中如果指定了 tools、model 等配置，优先遵循

## AI 协作规则

### 需求分析阶段

- 遇到模糊需求时，调用 requirements-clarity 技能进行深度澄清
- 需求清晰度评分必须 ≥ 90 分才能进入开发阶段
- 使用 需求分析师 智能体进行需求分析（先读取 myWorkFlow/agents/product-manager.md）

### 开发阶段

- 先出方案（Plan），确认后再执行
- 每个功能模块独立会话，避免上下文污染
- 遇到不确定的技术决策，提供多种方案供选择

### 常见错误与规避

1. AI 容易忽略边界情况处理 → 要求每个功能都列出边界 case
2. AI 容易过度设计 → 遵循 KISS 原则，先做 MVP
3. AI 容易忽略错误处理 → 要求每个接口都有错误处理逻辑
4. 上下文过长容易跑偏 → 功能模块间开新会话

## 会话管理

- 不同功能模块使用独立会话
- 长对话定期做上下文压缩（总结+继续）
- 不把所有需求一次性塞给 AI，分模块逐步推进

---

**本文件是动态演化的**：AI 每犯一次典型错误 → 增补一条规则。
