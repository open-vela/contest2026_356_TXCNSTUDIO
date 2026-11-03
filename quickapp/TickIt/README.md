# TickIt（TXCN 清单）

> A lightweight task & note management app designed for openvela smart wearables.
> 面向小米手环 9 Pro / 10 Pro（方屏）与圆屏手表（S1 Pro / H1 / S3 / S4）双形态的轻量级待办与便签应用。

TickIt 是由 **TXCN STUDIO** 开发的 openvela 快应用，针对手表屏幕小、输入效率低、使用时间碎片化等特点专门设计，在手腕上快速记录和管理日常事务。

---

# 一、作品简介

TickIt 提供**任务清单**与**便签**双模块：

- 任务：创建、编辑、完成、删除，支持优先级（高 / 中 / 低 + 置顶）与截止时间（今日 / 明日 / 3 天 / 无）
- 便签：随手记文字卡片，创建 / 编辑 / 删除
- 数据本地持久化，绑定云端账号后与「TXCN 清单」网页端（txcn.top/checklist）双向同步
- 同步删除支持三级范围：全部删除 / 仅删除本地 / 仅删除云端（含防复活机制）
- 离线模式可完整使用本地功能，恢复联网后继续同步

为提升手表输入体验，项目内置**手表面专用输入法组件**（适配方屏 / 胶囊 / 圆屏三种键盘形状）。

---

# 二、选题方向

**openvela 快应用 / 手表应用创新**

聚焦智能手表生产力工具，发挥 openvela 在穿戴设备上的优势，做真正适合手表使用场景的待办管理应用，而非手机应用的简单移植。

---

# 三、多屏适配

同一套代码通过 `isCircle` 双分支渲染 + JS 屏幕探测（`src/common/adapt.js`）覆盖两类形态：

| 形态 | 设备 | 布局 |
| --- | --- | --- |
| 方屏 336×480 | 小米手环 9 Pro / 10 Pro | 原生矩形布局（顶部返回 + 时间 + 标题三件套） |
| 圆屏 336×336 | S1 Pro / H1 / S3 / S4 | 设计稿整图背景 + 代码叠动态字，右划返回 |

---

# 四、页面与目录结构

```
src/
├── pages/            # 16 个页面
│   ├── home          # 首页（任务卡列表：高/中/低 + 置顶）
│   ├── numpad        # 创建清单（名称 + 优先级 + 截止时间）
│   ├── viewer        # 清单详情（完成 / 编辑 / 删除）
│   ├── notes         # 便签列表
│   ├── notecreate    # 创建便签
│   ├── noteedit      # 编辑便签
│   ├── priority      # 优先级选择页（滚轮）
│   ├── deadline      # 截止时间选择页（滚轮）
│   ├── list          # 设置（便签 / 云端同步 / 云端账号 / 关于 / 模式 / 清空）
│   ├── sync          # 云端同步状态页
│   ├── token         # 云端账号绑定（网页版绑定码）
│   ├── mode          # 在线 / 离线模式选择
│   ├── confirm       # 确认删除（三级删除范围）
│   ├── qrcode / logout / about
├── components/
│   └── InputMethod   # 手表面输入法（rect / pill / circle 三形状）
├── common/           # 图片素材、adapt.js 屏幕探测、utils.js
├── i18n/             # 多语言（中文 / English）
├── app.ux
└── manifest.json
build/                # 编译产物
dist/                 # 打包产物（RPK）
scripts/              # 辅助脚本
```

---

# 五、构建与运行

```bash
npm install

npm run start          # 开发预览（监听热更新）
npm run build          # 构建 debug 包
npm run release        # 构建 release 包（dist/*.rpk）

npm run build:circle   # 圆屏形状构建
npm run build:rect     # 方屏形状构建
```

生成的构建产物位于 `build/` 与 `dist/`，可按 openvela 快应用文档部署到模拟器或真机。

---

# 六、云端同步

1. 手表端「设置 → 云端账号」输入网页版绑定码（网页端 txcn.top/checklist 登录后「手表绑定」生成，10 分钟有效）
2. 绑定后任务 / 便签自动双向同步；离线产生的改动在恢复联网后继续同步
3. 删除时可选范围（全部 / 仅本地 / 仅云端），云端删除带防复活保护

云端网页端源码见仓库根目录 `web/`（配置已脱敏）。

---

# 七、AI Coding 使用说明

本项目采用 AI 辅助开发工作流（MiMoCode / MiMo 大模型），AI 参与环节包括：

* 需求拆解与产品方案设计
* 多屏适配方案与页面结构设计
* UI 与交互实现、代码生成与重构
* Bug 排查与修复、性能优化
* 云端网页端与手表端联调
* 文档编写与完善

最终代码均经人工验证、调试与优化。完整 AI Coding 对话记录见仓库 `logs/` 目录。

---

# 项目信息

开发团队：**TXCN STUDIO**
项目名称：**TickIt（TXCN 清单）**
比赛分支：`dev-ai-contest-2026`
代码仓库：https://github.com/txcn727-coder/contest2026_356_TXCNSTUDIO

---

# License

MIT License
