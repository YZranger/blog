# 🚀 yz's Geek Blog

> 一个疯狂的程序员打造的极客风格博客 ✨

![Blog](https://img.shields.io/badge/Made%20with-Vue.js-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ 特性

- 💻 **极客风格** - 终端风格 UI，Matrix 绿色代码雨背景
- ⚡ **极速体验** - 基于 Vite + Vue 3 + Tailwind CSS
- 📱 **响应式** - 完美支持移动端
- 🔐 **GitHub Issues 后端** - 文章和评论存储在 GitHub
- 💬 **评论区** - 访客可留言互动
- 🎨 **代码高亮** - 支持多种编程语言

---

## 🌐 访问

**博客地址**: https://yzranger.github.io/blog/

---

## 📝 如何写文章

### 方法一：通过管理后台（推荐）

1. 打开博客首页 https://yzranger.github.io/blog/
2. 点击导航栏 `Admin`
3. 输入你的 **GitHub Token**
4. 填写文章标题、标签、内容
5. 点击 `> Publish`

文章会自动创建为 GitHub Issue。

### 方法二：直接在 GitHub 创建 Issue

1. 打开 https://github.com/YZranger/blog/issues/new
2. 填写标题
3. 在正文写 Markdown 内容
4. 添加标签 `article`（必须）
5. 可添加其他标签如 `javascript`, `vue` 等

---

## 🔐 获取 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 设置 Note (如: yz-blog)
4. 勾选 **repo** 权限
5. 点击 **Generate**
6. 复制生成的 Token（格式: `ghp_xxxxxxxxxxxx`）

**Token 只显示一次，请妥善保存！**

---

## 💬 发表评论

1. 打开任意文章
2. 点击 `+ Add Comment`
3. 需要先在 Admin 登录 GitHub Token（用于验证身份）
4. 填写名字和留言内容
5. 点击 Submit

评论会作为 Issue 的评论显示。

---

## 🔧 管理

- **访问地址**: `/admin`
- **登录方式**: GitHub Token
- **权限**: 只有 Token 对应的 GitHub 账号才能发布文章

### 修改权限

编辑 `src/services/github.js` 中的 `allowedUsers` 数组：

```javascript
const allowedUsers = ['YZranger', '其他用户名']
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
│   │   ├── Home.vue      # 首页
│   │   ├── Post.vue      # 文章详情
│   │   └── Admin.vue     # 管理后台
│   ├── services/
│   │   └── github.js    # GitHub Issues API
│   ├── router/
│   │   └── index.js      # 路由配置
│   ├── App.vue           # 主组件
│   ├── main.js           # 入口文件
│   └── style.css         # 全局样式
├── public/
│   └── favicon.svg       # 网站图标
├── index.html
├── vite.config.js
└── package.json
```

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 许可证

MIT License © 2026 yz

---

> "Code is poetry, bugs are features" 🖥️
