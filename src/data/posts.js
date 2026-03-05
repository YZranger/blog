// 博客文章数据
// 在这里写你的文章，id 是唯一标识

export const posts = [
  {
    id: 'hello-world',
    title: '你好，世界！',
    date: '2026-03-05',
    author: 'yz',
    tags: ['intro', 'hello'],
    content: `
# 你好，世界！ 🚀

欢迎来到我的极客博客！

## 关于这个博客

这是一个**疯狂的程序员**打造的极客风格博客。

### 技术栈

- Vue.js 3
- Vite
- 纯手工打造 🎨

### 特性

- 💻 代码高亮
- 🌙 暗黑模式
- ⚡ 闪电般速度

> "代码是诗， 是韵bug脚"

---

**未完待续...**
    `
  },
  {
    id: 'why-code',
    title: '为什么我爱写代码',
    date: '2026-03-05',
    author: 'yz',
    tags: ['coding', 'philosophy'],
    content: `
# 为什么我爱写代码

当你解决一个问题时的那种快感，是无法描述的。

## 代码即创造

\`\`\`javascript
while (alive) {
  code();
  learn();
  improve();
}
\`\`\`

每一行代码都是创造世界的咒语。

---

*保持热情，保持疯狂*
    `
  }
]

// 模拟评论数据（实际项目中应该用后端数据库）
export const comments = [
  {
    id: 1,
    postId: 'hello-world',
    name: '游客',
    content: '太酷了！',
    date: '2026-03-05'
  }
]

// 添加评论
export function addComment(postId, name, content) {
  const newComment = {
    id: Date.now(),
    postId,
    name,
    content,
    date: new Date().toISOString().split('T')[0]
  }
  comments.push(newComment)
  return newComment
}

// 验证管理员密码（简单实现，实际用后端）
export function verifyAdmin(password) {
  return password === 'yz123456'
}

// 添加文章
export function addPost(post) {
  const newPost = {
    id: post.title.toLowerCase().replace(/\s+/g, '-'),
    ...post,
    date: new Date().toISOString().split('T')[0]
  }
  posts.unshift(newPost)
  return newPost
}
