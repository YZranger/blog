<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPost, verifyAdmin } from '../services/github.js'

const router = useRouter()

const isAuthenticated = ref(false)
const username = ref('')
const token = ref('')
const error = ref('')

const checkAuth = () => {
  const savedToken = localStorage.getItem('github_token')
  const savedUsername = localStorage.getItem('github_username')
  if (savedToken && savedUsername) {
    token.value = savedToken
    username.value = savedUsername
    isAuthenticated.value = true
  }
}
checkAuth()

const newPost = ref({
  title: '',
  tags: '',
  content: ''
})

const submitting = ref(false)

const login = async () => {
  if (!token.value) {
    error.value = '// 请输入 GitHub Token'
    return
  }
  
  const result = await verifyAdmin(token.value)
  if (result.valid) {
    localStorage.setItem('github_token', token.value)
    localStorage.setItem('github_username', result.username)
    username.value = result.username
    isAuthenticated.value = true
    error.value = ''
  } else {
    error.value = '// Token 无效或没有权限'
  }
}

const submitPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    error.value = '// 标题和内容不能为空'
    return
  }
  
  submitting.value = true
  const tags = newPost.value.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
  
  const result = await createPost(
    newPost.value.title,
    newPost.value.content,
    tags,
    token.value
  )
  
  submitting.value = false
  
  if (result.success) {
    alert('文章发布成功！')
    newPost.value = { title: '', tags: '', content: '' }
    router.push(`/post/${result.id}`)
  } else {
    error.value = '// 发布失败: ' + result.error
  }
}

const logout = () => {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_username')
  token.value = ''
  username.value = ''
  isAuthenticated.value = false
}
</script>

<template>
  <div class="admin-page">
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="terminal-window">
        <div class="terminal-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="terminal-title">~/admin</span>
        </div>
        <div class="terminal-body">
          <p><span class="prompt">$</span> <span class="cmd">./login.sh</span></p>
          <p class="output">请输入 GitHub Token:</p>
          
          <form @submit.prevent="login" class="login-form">
            <input 
              v-model="token" 
              type="password" 
              placeholder="ghp_xxxxxxxxxxxx"
              class="password-input"
              autofocus
            />
            <button type="submit" class="login-btn">Login</button>
          </form>
          
          <p v-if="error" class="error">{{ error }}</p>
          
          <div class="token-help">
            <p class="help-title">// 如何获取 GitHub Token:</p>
            <ol class="help-list">
              <li>访问 <span class="highlight">GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)</span></li>
              <li>点击 <span class="highlight">Generate new token (classic)</span></li>
              <li>设置 Note (如: yz-blog)</li>
              <li>勾选 <span class="highlight">repo</span> 权限</li>
              <li>点击 Generate，复制生成的 Token</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Panel -->
    <div v-else class="admin-panel">
      <div class="admin-header">
        <h1>> 管理后台</h1>
        <div class="user-info">
          <span class="username">@{{ username }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>

      <div class="editor-container">
        <div class="terminal-window">
          <div class="terminal-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="terminal-title">~/new-post.md</span>
          </div>
          <div class="terminal-body">
            <form @submit.prevent="submitPost">
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
                <button type="submit" :disabled="submitting" class="publish-btn">
                  {{ submitting ? 'Publishing...' : '> Publish' }}
                </button>
                <button type="button" @click="router.push('/')" class="preview-btn">
                  Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="tips">
        <h3>// 快捷提示</h3>
        <ul class="tips-list">
          <li><code>#</code> 一级标题</li>
          <li><code>##</code> 二级标题</li>
          <li><code>**文字**</code> 粗体</li>
          <li><code>*文字*</code> 斜体</li>
          <li><code>- 文字</code> 列表</li>
          <li><code>> 文字</code> 引用</li>
          <li><code>`代码`</code> 行内代码</li>
          <li><code>```js</code> 代码块</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page { max-width: 900px; margin: 0 auto; }

.terminal-window {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.dot { width: 12px; height: 12px; border-radius: 50%; }
.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

.terminal-title {
  margin-left: 10px;
  color: var(--text-dim);
  font-size: 0.85rem;
}

.terminal-body { padding: 1.5rem; }
.terminal-body p { margin: 0.5rem 0; }

.prompt { color: #ff0055; }
.cmd { color: var(--text-secondary); }
.output { color: var(--text-primary); margin-top: 0.5rem; }

.login-form {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.password-input {
  flex: 1;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
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
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.login-btn:hover { background: var(--accent-hover); }

.error {
  color: #ff0055;
  margin-top: 1rem;
}

.token-help {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.help-title { color: var(--text-dim); font-size: 0.85rem; margin-bottom: 0.8rem; }

.help-list {
  color: var(--text-dim);
  font-size: 0.8rem;
  list-style: decimal;
  padding-left: 1.2rem;
  line-height: 1.8;
}

.highlight { color: var(--text-primary); }

/* Admin Panel */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-header h1 { color: var(--text-primary); }

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username { color: var(--text-dim); font-size: 0.9rem; }

.logout-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: inherit;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  border-color: #ff0055;
  color: #ff0055;
}

.editor-container { margin-bottom: 2rem; }

.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; color: var(--accent); margin-bottom: 0.5rem; }

.form-input, .form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-textarea { resize: vertical; line-height: 1.6; }

.form-actions { display: flex; gap: 1rem; margin-top: 1rem; }

.publish-btn, .preview-btn {
  flex: 1;
  padding: 1rem;
  border-radius: 6px;
  font-family: inherit;
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

.publish-btn:disabled { opacity: 0.5; }

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

.tips h3 { color: var(--text-primary); margin-bottom: 1rem; }

.tips-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
}

.tips-list li { color: var(--text-secondary); }

.tips-list code {
  background: var(--bg-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--accent);
  margin-right: 0.5rem;
}
</style>
