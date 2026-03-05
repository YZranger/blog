# 🚀 yz's Geek Blog

> 一个疯狂的程序员打造的极客风格博客

![Blog Preview](https://img.shields.io/badge/Made%20with-Vue.js-green?style=flat&logo=vue.js)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ 特性

- 💻 **极客风格** - 终端风格 UI，Matrix 绿色代码雨背景
- ⚡ **极速体验** - 基于 Vite + Vue 3
- 📱 **响应式** - 完美支持移动端
- 🔐 **管理后台** - 只有你能发布文章
- 💬 **评论区** - 访客可留言互动

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

## 📝 如何写文章

### 方法一：通过管理后台（推荐）

1. 打开博客首页
2. 点击导航栏 `Admin`
3. 输入管理密码：`yz123456`
4. 填写文章标题、标签、内容
5. 点击 `> Publish` 发布

### 方法二：直接编辑 Markdown 文件

打开 `src/data/posts.js`，按格式添加文章：

```javascript
{
  id: 'unique-id',           // 唯一标识（英文）
  title: '文章标题',          // 中文标题
  date: '2026-03-05',       // 发布日期
  author: 'yz',             // 作者
  tags: ['标签1', '标签2'],   // 文章标签
  content: `
# 大标题

正文内容...

## 二级标题

- 列表项 1
- 列表项 2

> 引用内容

\`\`\`javascript
// 代码块
console.log('Hello!');
\`\`\`
`
}
```

### Markdown 语法支持

| 语法 | 效果 |
|------|------|
| `# 标题` | 一级标题 |
| `## 标题` | 二级标题 |
| `**粗体**` | **粗体** |
| `*斜体*` | *斜体* |
| `- 列表` | 列表项 |
| `> 引用` | 引用块 |
| `` `代码` `` | 行内代码 |
| ```` ```javascript ```` | 代码块 |

---

## 🔐 管理后台

- **访问地址**: `/admin`
- **默认密码**: `yz123456`

### 修改密码

编辑 `src/data/posts.js` 中的 `verifyAdmin` 函数：

```javascript
export function verifyAdmin(password) {
  return password === '你的新密码'
}
```

---

## 🌐 部署到 GitHub Pages

### 方式一：自动部署（推荐）

项目已配置 GitHub Actions，每次推送自动部署！

```bash
# 1. 创建 GitHub 仓库
# 2. 推送代码
git add .
git commit -m "init blog"
git remote add origin https://github.com/你的用户名/blog.git
git push -u origin master

# 3. 启用 GitHub Pages
# 仓库设置 → Pages → Source: GitHub Actions
```

### 方式二：手动部署

```bash
# 构建生产版本
pnpm build

# 推送 dist 文件夹到 gh-pages 分支
cd dist
git init
git add .
git commit -m "deploy"
git push -f https://github.com/你的用户名/blog.git master:gh-pages
```

---

## 📁 目录结构

```
blog/
├── src/
│   ├── views/
│   │   ├── Home.vue      # 首页
│   │   ├── Post.vue      # 文章详情
│   │   └── Admin.vue     # 管理后台
│   ├── router/
│   │   └── index.js      # 路由配置
│   ├── data/
│   │   └── posts.js      # 文章数据
│   ├── App.vue           # 主组件
│   └── main.js           # 入口文件
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
