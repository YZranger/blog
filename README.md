# 🚀 yz's Geek Blog

> 一个疯狂的程序员打造的极客风格博客 ✨

![Blog](https://img.shields.io/badge/Made%20with-Vue.js-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ 特性

- 💻 **极客风格** - 终端风格 UI，Matrix 绿色代码雨背景
- ⚡ **极速体验** - 基于 Vite + Vue 3 + Tailwind CSS
- 📱 **响应式** - 完美支持移动端
- 🔐 **GitHub Issues 后端** - 文章存储在 GitHub
- 💬 **评论区** - 通过 GitHub 互动，作者标识
- 🎨 **代码高亮** - 支持多种编程语言

---

## 🌐 访问

**博客地址**: https://yzranger.github.io/blog/

**首页**: https://yzranger.github.io/blog/
**文章列表**: https://yzranger.github.io/blog/blog

---

## 📝 如何写文章

### 在 GitHub 上创建 Issue

1. 打开 https://github.com/YZranger/blog/issues/new
2. 填写文章标题
3. 在正文写 Markdown 格式内容
4. 添加标签 `article`（必须！否则不会显示）
5. 可添加其他标签如 `javascript`, `vue`, `tutorial` 等
6. 点击 Submit

### 快捷入口

首页有两个快捷按钮：
- **GitHub** - 查看源码
- **Write Post** - 快速创建新文章

---

## 💬 发表评论与回复

### 发表评论

1. 打开任意文章
2. 点击底部「在 GitHub 上评论」按钮
3. 在 GitHub Issue 页面填写评论
4. 点击 Comment 提交

### 回复他人评论

在评论中使用 `@用户名` 提及对方，即可实现回复效果。

### 作者标识

当评论者与文章作者是同一人时，会显示「作者」标识，便于区分。

---

## 📝 文章格式示例

```markdown
# 我的第一篇文章

这是一篇测试文章。

## 代码示例

```javascript
function hello() {
  console.log('Hello, World!');
}
```

## 列表

- 项目 1
- 项目 2

> 这是一段引用
```

---

## 🛠️ 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173/blog/

---

## 📁 目录结构

```
blog/
├── src/
│   ├── views/
│   │   ├── Home.vue    # 首页（炫酷动画）
│   │   ├── Blog.vue   # 文章列表
│   │   └── Post.vue   # 文章详情 + 评论
│   ├── services/
│   │   └── github.js  # GitHub Issues API
│   ├── router/
│   │   └── index.js   # 路由配置
│   ├── App.vue        # 主组件
│   └── style.css      # 全局样式
├── public/
│   └── favicon.svg
├── index.html
└── package.json
```

---

## 📄 许可证

MIT License © 2026 yz

---

> "Code is poetry, bugs are features" 🖥️
