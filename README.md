# TickIt

> **一款专为 openvela 智能手表打造的轻量级待办清单应用**
> 基于 openvela QuickApp 开发，为手表场景提供高效、便捷、低学习成本的任务管理体验。

---

# 一、作品简介

TickIt 是一款面向 openvela 智能手表的待办事项（To-do）管理应用，针对手表屏幕尺寸小、输入效率低、操作时间碎片化等特点进行了专门设计。

应用采用简洁直观的交互方式，支持任务创建、编辑、完成、删除、优先级管理、截止日期设置、本地存储以及云端同步等功能，使用户能够在手腕上快速记录和管理日常事务。

为了提升手表输入体验，本项目还实现了适配手表场景的输入方式，使文字输入更加高效。

---

# 二、选题方向

**openvela 快应用 / 手表应用创新**

本项目聚焦智能手表生产力工具，希望充分发挥 openvela 在穿戴设备上的优势，为用户提供真正适合手表使用场景的待办管理应用，而不是简单移植手机应用。

---

# 三、主要功能

* 创建、编辑、删除待办事项
* 标记任务完成
* 任务优先级管理
* 截止日期管理
* 本地数据持久化
* 云端同步
* 离线模式
* 二维码绑定
* 多语言支持（中文 / English）
* 针对手表优化的交互体验

---

# 四、项目目录

```
quickapp/
└── TickIt/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── common/
    │   ├── i18n/
    │   ├── app.ux
    │   └── manifest.json
    ├── build/
    ├── dist/
    ├── scripts/
    ├── package.json
    └── README.md

logs/
    AI Coding 日志

contest2026_356_TXCNSTUDIO.xml
    openvela Manifest 映射配置
```

项目通过 `contest2026_356_TXCNSTUDIO.xml` 中的 `<linkfile>` 将 `quickapp/TickIt` 自动映射到 openvela 工程，无需手动复制代码。

---

# 五、编译与运行

## 1. 拉取 openvela 工程

按照官方文档初始化工程：

```bash
repo init -u https://github.com/open-vela/contest2026_356_TXCNSTUDIO \
-b dev-ai-contest-2026 \
-m contest2026_356_TXCNSTUDIO.xml

repo sync -c -j8
```

## 2. 安装依赖

进入项目目录：

```bash
cd quickapp/TickIt
npm install
```

## 3. 开发运行

```bash
npm run start
```

## 4. 构建

```bash
npm run build
```

## 5. 发布

```bash
npm run release
```

生成的构建产物位于：

```
quickapp/TickIt/build/
quickapp/TickIt/dist/
```

可按照 openvela 快应用开发文档部署到模拟器或支持 openvela 的设备进行运行。

---

# 六、AI Coding 使用说明

本项目充分利用 AI 辅助完成开发，提高开发效率与代码质量。

AI 主要参与以下环节：

* 产品需求分析
* 功能规划
* 页面结构设计
* UI 与交互优化
* JavaScript 逻辑实现
* Bug 排查与修复
* Git/GitHub 仓库管理
* openvela 工程适配
* 文档编写与完善

AI 在整个开发过程中作为辅助工具参与方案讨论、代码生成、问题分析及文档整理，最终代码均经过人工验证、调试与优化。

完整 AI Coding 对话记录已按照比赛要求整理并提交至 `logs/` 目录。

---

# 七、项目亮点

* 面向智能手表重新设计的待办应用
* 针对小屏设备优化交互体验
* 支持云同步与离线使用
* 多语言支持
* 模块化项目结构
* 基于 openvela QuickApp 开发
* 易于扩展与维护

---

# 作者

**TXCN STUDIO**

项目名称：**TickIt**

2026 openvela AI 硬件开发者大赛参赛作品
