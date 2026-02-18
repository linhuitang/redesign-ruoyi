# Redesign RuoYi - 现代化 RuoYi-Vue 前端重构

![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?style=flat&logo=vite&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.13+-409EFF?style=flat&logo=element-plus&logoColor=white)
![UnoCSS](https://img.shields.io/badge/UnoCSS-66+-333333?style=flat&logo=unocss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**Redesign RuoYi** 是基于 [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) 的现代化前端重构版本。我们保留了若依强大的权限管理和业务逻辑，采用 **Vue 3 + Vite + Element Plus + UnoCSS** 技术栈对其 UI/UX 进行了全面升级。

✨ **核心亮点：后端零修改**。本项目与 RuoYi-Vue 后端接口 **完全兼容**，您无需修改任何 Java 代码，只需部署本前端项目，即可获得全新的现代化管理系统体验。

## ✨ 核心特性

- 🔌 **完美兼容** - 与 RuoYi-Vue 后端 API 无缝对接，开箱即用，无需调整后端接口。
- 🎨 **全新设计** - 参考 [TDesign Starter](https://tdesign.tencent.com/starter/vue-next) 设计规范，界面更加清爽、简洁。
- ⚡ **极速开发** - 基于 Vite (Rolldown) 构建，毫秒级热更新，秒级启动。
- 🧩 **原子化 CSS** - 引入 UnoCSS，样式开发更高效，体积更小。
- 📱 **响应式布局** - 完美适配 PC、平板和移动端，随时随地管理业务。
- 🌙 **暗黑模式** - 内置系统级暗黑模式支持，一键切换。
- 🔒 **权限管理** - 细粒度的页面和按钮级权限控制。
- 🛠 **丰富组件** - 集成富文本、字典、代码生成、图表等常用业务组件。

## 🛠 技术栈

| 技术 | 版本 | 说明 |
| :--- | :--- | :--- |
| [Vue.js](https://vuejs.org/) | 3.5+ | 渐进式 JavaScript 框架 |
| [Vite](https://vitejs.dev/) | Rolldown | 下一代前端构建与开发工具 |
| [Element Plus](https://element-plus.org/) | 2.13+ | 基于 Vue 3 的组件库 |
| [TDesign](https://tdesign.tencent.com/) | Starter | 部分界面与样式参考 |
| [Pinia](https://pinia.vuejs.org/) | 3.0+ | 新一代 Vue 状态管理库 |
| [Vue Router](https://router.vuejs.org/) | 4.6+ | Vue.js 官方路由管理器 |
| [UnoCSS](https://unocss.dev/) | 0.66+ | 即时原子化 CSS 引擎 |
| [ECharts](https://echarts.apache.org/) | 6.0+ | 强大的数据可视化库 |

## 🚀 快速开始

### 环境准备

确保您的本地环境已安装：

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0

### 安装与启动

1.  **克隆项目**

    ```bash
    git clone https://github.com/linhuitang/redesign-ruoyi.git
    cd redesign-ruoyi
    ```

2.  **安装依赖**

    ```bash
    npm install
    # 或者使用 pnpm (推荐)
    # pnpm install
    ```

3.  **启动开发服务器**

    ```bash
    npm run dev
    ```

    启动后访问：`http://localhost:80`

### 构建部署

构建生产环境版本：

```bash
npm run build
```

构建完成后，生成的静态文件位于 `dist` 目录，可部署至 Nginx、Apache 或任何静态文件服务器。

本地预览生产构建：

```bash
npm run preview
```

## ⚙️ 环境配置

项目支持多环境配置，通过 `.env` 文件管理：

### 开发环境 (`.env.development`)

```ini
# 页面标题
VITE_APP_TITLE = Redesign RuoYi

# 接口地址（本地代理目标）
VITE_APP_BASE_API = '/dev-api'
```

### 生产环境 (`.env.production`)

```ini
# 页面标题
VITE_APP_TITLE = Redesign RuoYi

# 接口地址（线上真实地址）
VITE_APP_BASE_API = 'http://api.your-domain.com'
```

## 📁 目录结构

```text
src/
├── api/                # 后端接口统一定义
├── assets/             # 静态资源 (图片, 图标, 样式)
├── components/         # 全局通用组件
├── directive/          # 自定义指令 (v-hasPermi 等)
├── layout/             # 页面布局组件 (Sidebar, Navbar)
├── plugins/            # 插件注册
├── router/             # 路由配置与守卫
├── store/              # Pinia 状态管理
├── utils/              # 通用工具函数 (request, auth)
└── views/              # 页面视图组件
    ├── dashboard/      # 仪表盘
    ├── system/         # 系统管理 (用户, 角色, 菜单)
    ├── tool/           # 系统工具 (代码生成, Swagger)
    └── ...
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！如果您觉得本项目对您有帮助，请给一个 ⭐️ Star。

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

## 👏 致谢

- [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) - 若依官方 Vue 版本
- [TDesign Starter](https://tdesign.tencent.com/starter/vue-next) - 参考其现代化的界面与样式设计
- [Element Plus](https://element-plus.org)
- [Vue.js](https://vuejs.org)
