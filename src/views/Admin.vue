<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addPost, verifyAdmin } from '../data/posts.js'

const router = useRouter()

const isAuthenticated = ref(false)
const password = ref('')
const error = ref('')

const newPost = ref({
  title: '',
  tags: '',
  content: ''
})

const login = () => {
  if (verifyAdmin(password.value)) {
    isAuthenticated.value = true
    error.value = ''
  } else {
    error.value = '// 密码错误，请重试'
  }
}

const submitPost = () => {
  if (!newPost.value.title || !newPost.value.content) {
    error.value = '// 标题和内容不能为空'
    return
  }
  
  const tags = newPost.value.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
  
  addPost({
    title: newPost.value.title,
    tags,
    content: newPost.value.content,
    author: 'yz'
  })
  
  // Reset form
  newPost.value = { title: '', tags: '', content: '' }
  error.value = ''
  
  // Go to home
  router.push('/')
}

const logout = () => {
  isAuthenticated.value = false
  password.value = ''
}
</script>

<template>
  <div class="admin-page">
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="terminal-window">
        <div class="terminal-header">
          <span class="terminal-dot red"></span>
          <span class="terminal-dot yellow"></span>
          <span class="terminal-dot green"></span>
          <span class="terminal-title">~/admin</span>
        </div>
        <div class="terminal-body">
          <p><span class="prompt">$</span> ./login.sh</p>
          <p class="output">请输入管理密码:</p>
          
          <form @submit.prevent="login" class="login-form">
            <input 
              v-model="password" 
              type="password" 
              placeholder="password..."
              class="password-input"
              autofocus
            />
            <button type="submit" class="login-btn">Login</button>
          </form>
          
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else class="admin-panel">
      <div class="admin-header">
        <h1>> 管理后台</h1>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>

      <div class="editor-container">
        <div class="terminal-window">
          <div class="terminal-header">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">~/new-post.md</span>
          </div>
          <div class="terminal-body">
            <form @submit.prevent="submitPost" class="post-form">
              <div class="form-group">
                <label>> 文章标题:</label>
                <input 
                  v-model="newPost.title" 
                  type="text" 
                  placeholder="标题..."
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>> 标签 (用逗号分隔):</label>
                <input 
                  v-model="newPost.tags" 
                  type="text" 
                  placeholder="javascript, vue, tutorial"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>> 文章内容 (支持 Markdown):</label>
                <textarea 
                  v-model="newPost.content" 
                  placeholder="在这里写你的文章...

支持 Markdown 语法:
# 大标题
## 二级标题
**粗体** *斜体*
- 列表项
> 引用
`代码`
---
"
                  class="form-textarea"
                  rows="15"
                ></textarea>
              </div>

              <p v-if="error" class="error">{{ error }}</p>

              <div class="form-actions">
                <button type="submit" class="publish-btn">
                  > Publish
                </button>
                <button type="button" class="preview-btn" @click="router.push('/')">
                  Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="tips">
        <h3>// 快捷提示</h3>
        <ul>
          <li><code>#</code> - 一级标题</li>
          <li><code>##</code> - 二级标题</li>
          <li><code>**文字**</code> - 粗体</li>
          <li><code>*文字*</code> - 斜体</li>
          <li><code>- 文字</code> - 列表</li>
          <li><code>> 文字</code> - 引用</li>
          <li><code>`代码`</code> - 行内代码</li>
          <li><code>```语言</code> - 代码块</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 0 auto;
}

/* Login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.terminal-window {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  width: 100%;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.terminal-title {
  margin-left: 10px;
  color: var(--text-dim);
  font-size: 0.85rem;
}

.terminal-body {
  padding: 1.5rem;
}

.terminal-body p {
  margin: 0.5rem 0;
}

.prompt {
  color: #ff0055;
}

.output {
  color: var(--text-secondary);
  margin-top: 1rem;
}

.login-form {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.password-input {
  flex: 1;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.password-input:focus {
  outline: none;
  border-color: var(--accent);
}

.login-btn {
  padding: 0.8rem 1.5rem;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-weight: 600;
  cursor: pointer;
}

.login-btn:hover {
  background: var(--accent-hover);
}

.error {
  color: #ff0055;
  margin-top: 1rem;
}

/* Admin Panel */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-header h1 {
  color: var(--text-primary);
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  border-color: #ff0055;
  color: #ff0055;
}

.editor-container {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.95rem;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-textarea {
  resize: vertical;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.publish-btn,
.preview-btn {
  flex: 1;
  padding: 1rem;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.publish-btn {
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
}

.publish-btn:hover {
  background: var(--accent-hover);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
}

.preview-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.preview-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.tips {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.tips h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.tips ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.tips li {
  color: var(--text-secondary);
}

.tips code {
  background: var(--bg-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--accent);
  margin-right: 0.5rem;
}
</style>