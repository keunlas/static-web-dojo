# 参考资料

本目录存放修行过程中需要用到的**离线参考资料**，无需联网即可查阅。

> ⚠️ **重要提醒**：本目录仅用于存放原始离线资源，**不应在项目中直接引用**。需要使用时，请将所需文件复制到项目目录中再引用。生产环境部署时本目录可能不存在。

## 目录结构

```
reference/
├── bootstrap/                  # Bootstrap 相关资源
│   ├── bootstrap-5.3.8-dist/   # 编译好的 CSS 与 JS 文件
│   ├── bootstrap-5.3.8-examples/  # 官方示例（相册、博客、轮播等）
│   ├── bootstrap-icons-1.13.1/    # Bootstrap 图标库
│   └── bootstrap-offline-docs-5.3/  # Bootstrap 离线文档
└── jquery/                     # jQuery 相关资源
    ├── jquery-4.0.0.js         # 完整版
    ├── jquery-4.0.0.min.js     # 压缩版
    ├── jquery-4.0.0.slim.js    # 精简版（不含 Ajax）
    └── jquery-4.0.0.slim.min.js  # 精简压缩版
```

## Bootstrap 5.3.8

### 发行文件（dist）

从本目录复制所需文件到项目中，然后在 HTML 中引用。

#### 开发版与生产版的区别

| 类型 | 开发版          | 生产版              | 说明                                       |
| ---- | --------------- | ------------------- | ------------------------------------------ |
| CSS  | `bootstrap.css` | `bootstrap.min.css` | 生产版移除了空格、注释和换行，文件体积更小 |
| JS   | `bootstrap.js`  | `bootstrap.min.js`  | 同上，生产版经过压缩混淆                   |

- **开发时**用未压缩版（`.css` / `.js`）：方便阅读源码和调试
- **部署时**用压缩版（`.min.css` / `.min.js`）：加载更快，节省带宽
- `.map` 文件是 Source Map，用于在浏览器开发者工具中定位压缩代码的源码位置，开发时可一同复制，部署时可删除

#### CSS 文件列表

| 文件                      | 说明                                 |
| ------------------------- | ------------------------------------ |
| `bootstrap.css`           | **完整版**，包含所有组件样式         |
| `bootstrap-grid.css`      | 仅包含栅格系统                       |
| `bootstrap-reboot.css`    | 仅包含样式重置（Normalize）          |
| `bootstrap-utilities.css` | 仅包含工具类                         |
| `*.min.css`               | 以上各文件的压缩版                   |
| `*.rtl.css`               | 以上各文件的 RTL（从右到左）语言版本 |

#### JS 文件列表

| 文件                  | 说明                                               |
| --------------------- | -------------------------------------------------- |
| `bootstrap.bundle.js` | **完整版**，包含 Popper.js，推荐使用               |
| `bootstrap.js`        | 不含 Popper.js，需自行引入 Popper.js               |
| `bootstrap.esm.js`    | ES Module 版本，适合现代构建工具（Webpack / Vite） |
| `*.min.js`            | 以上各文件的压缩版                                 |

> **初学者建议**：直接使用 `bootstrap.bundle.min.js`，一步到位，无需额外引入 Popper.js。

### 官方示例（examples）

收录了 Bootstrap 官方提供的多种页面模板，适合学习与参考：

| 示例                    | 说明                     |
| ----------------------- | ------------------------ |
| `album/`                | 图片相册布局             |
| `badges/`               | 徽章组件                 |
| `blog/`                 | 博客页面布局             |
| `breadcrumbs/`          | 面包屑导航               |
| `buttons/`              | 按钮组件                 |
| `carousel/`             | 轮播图组件               |
| `cheatsheet/`           | 速查表                   |
| `checkout/`             | 结账表单                 |
| `cover/`                | 封面页                   |
| `dashboard/`            | 仪表盘布局               |
| `dropdowns/`            | 下拉菜单                 |
| `features/`             | 功能特性展示             |
| `footers/`              | 页脚样式合集             |
| `grid/`                 | 栅格系统演示             |
| `headers/`              | 页头样式合集             |
| `heroes/`               | 英雄区域（Hero Section） |
| `jumbotron/`            | 巨幕组件                 |
| `jumbotrons/`           | 巨幕组件合集             |
| `list-groups/`          | 列表组组件               |
| `masonry/`              | 瀑布流布局               |
| `modals/`               | 模态框组件               |
| `navbar-bottom/`        | 底部导航栏               |
| `navbar-fixed/`         | 固定导航栏               |
| `navbar-static/`        | 静态导航栏               |
| `navbars/`              | 导航栏合集               |
| `navbars-offcanvas/`    | Offcanvas 导航栏         |
| `offcanvas/`            | Offcanvas 侧边栏         |
| `offcanvas-navbar/`     | Offcanvas 导航栏布局     |
| `pricing/`              | 定价表                   |
| `product/`              | 产品展示页               |
| `sidebars/`             | 侧边栏布局               |
| `sign-in/`              | 登录页                   |
| `starter-template/`     | 起步模板                 |
| `sticky-footer/`        | 吸底页脚                 |
| `sticky-footer-navbar/` | 带导航栏的吸底页脚       |

> 部分示例带有 `-rtl/` 后缀，表示阿拉伯语等从右到左书写的语言版本。

每个示例都是独立的 HTML 文件，可直接用浏览器打开查看效果与源码。

### 图标库（Icons）

Bootstrap 官方图标库，包含 2000+ 个矢量图标：

```html
<!-- 引入图标 CSS（二选一） -->
<link rel="stylesheet" href="bootstrap-icons.css">        <!-- 开发版 -->
<link rel="stylesheet" href="bootstrap-icons.min.css">    <!-- 生产版 -->

<!-- 使用图标 -->
<i class="bi-alarm"></i>
<i class="bi-house-door-fill"></i>
```

| 文件                      | 说明                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `bootstrap-icons.css`     | 开发版，包含完整代码和注释                                    |
| `bootstrap-icons.min.css` | 生产版，经过压缩，体积更小                                    |
| `bootstrap-icons.scss`    | SCSS 源文件，适合需要自定义编译的场景                         |
| `bootstrap-icons.json`    | 图标元数据，可用于构建工具或搜索                              |
| `bootstrap-icons.svg`     | SVG Sprite 文件，适用于 `<use>` 方式引用                      |
| `fonts/`                  | 包含 `.woff` 和 `.woff2` 字体文件，CSS 通过 `@font-face` 引用 |

> **注意**：`fonts/` 目录必须与 CSS 文件一起复制，图标才能正常显示。

### 离线文档（offline-docs）

完整的 Bootstrap 5.3 离线文档，用浏览器打开 `index.html` 即可浏览。

## jQuery 4.0.0

根据需要选择一个版本，复制到项目中使用：

```html
<!-- 完整版（推荐开发环境使用） -->
<script src="jquery-4.0.0.js"></script>

<!-- 压缩版（推荐生产环境使用） -->
<script src="jquery-4.0.0.min.js"></script>

<!-- 精简版（不需要 Ajax 功能时使用） -->
<script src="jquery-4.0.0.slim.js"></script>
```

## 使用建议

1. **先看示例，再动手写** — 每学一个新组件，先去 `examples/` 目录找到对应示例，理解结构后再自己实现
2. **善用离线文档** — 遇到不确定的类名或用法，打开离线文档查阅，比上网搜索更快
3. **图标随手查** — 需要图标时，浏览 `bootstrap-icons.css` 源码或查阅离线文档中的图标列表
4. **复制后再引用** — 需要使用资源时，先复制到项目目录（如 `libs/`），再从项目目录引用，确保部署时不依赖本目录

