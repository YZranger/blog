<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createPost, addComment, verifyAdmin } from '../services/github.js'

const router = useRouter()
const activeTab = ref('post') // 'post' or 'comment'

// Auth state
const isAuthenticated = ref(false)
const username = ref('')
const token = ref('')
const error = ref('')

// Check localStorage on mount
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

// Post form
const newPost = ref({
  title: '',
  tags: '',
  content: ''
})
const postSubmitting = ref(false)
const postSuccess = ref(false)

// Comment form
const commentForm = ref({
  postId: '',
  content: ''
})
const commentSubmitting = ref(false)
const commentSuccess = ref(false)

// Get posts for comment dropdown
import { getPosts } from '../services/github.js'
const posts = ref([])
getPosts().then(p => posts.value = p)

const login = async () => {
  if (!token.value) {
    error.value = '请输入 GitHub Token'
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
    error.value = 'Token 无效或没有权限'
  }
}

const logout = () => {
  localStorage.removeItem('github_token')
  localStorage.removeItem('github_username')
  token.value = ''
  username.value = ''
  isAuthenticated.value = false
}

const submitPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    error.value = '标题和内容不能为空'
    return
  }
  
  postSubmitting.value = true
  error.value = ''
  
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
  
  postSubmitting.value = false
  
  if (result.success) {
    postSuccess.value = true
    newPost.value = { title: '', tags: '', content: '' }
    setTimeout(() => {
      postSuccess.value = false
      router.push(`/post/${result.id}`)
    }, 1500)
  } else {
    error.value = '发布失败: ' + result.error
  }
}

const submitComment = async () => {
  if (!commentForm.value.postId || !commentForm.value.content) {
    error.value = '请选择文章并填写评论内容'
    return
  }
  
  commentSubmitting.value = true
  error.value = ''
  
  const result = await addComment(
    commentForm.value.postId,
    username.value,
    commentForm.value.content,
    token.value
  )
  
  commentSubmitting.value = false
  
  if (result.success) {
    commentSuccess.value = true
    commentForm.value = { postId: '', content: '' }
    setTimeout(() => {
      commentSuccess.value = false
    }, 1500)
  } else {
    error.value = '评论失败: ' + result.error
  }
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
          
          <p v-if="error" class="error-msg">{{ error }}</p>
          
          <div class="token-help">
            <p class="help-title">// 如何获取 Token:</p>
            <ol class="help-list">
              <li>访问 <span class="highlight">GitHub Settings → Developer settings → Personal access tokens</span></li>
              <li>Generate new token (classic)</li>
              <li>勾选 <span class="highlight">repo</span> 权限</li>
              <li>复制生成的 Token</li>
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

      <!-- Tabs -->
      <div class="tabs">
        <button 
          @click="activeTab = 'post'" 
          class="tab-btn"
          :class="{ active: activeTab === 'post' }"
        >
          写文章
        </button>
        <button 
          @click="activeTab = 'comment'" 
          class="tab-btn"
          :class="{ active: activeTab === 'comment' }"
        >
          写评论
        </button>
      </div>

      <!-- Post Form -->
      <div v-if="activeTab === 'post'" class="form-container">
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
                <label>> 标签 (逗号分隔):</label>
                <input 
                  v-model="newPost.tags" 
                  type="text" 
                  placeholder="javascript, vue"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>> 内容 (Markdown):</label>
                <textarea 
                  v-model="newPost.content" 
                  placeholder="在这里写文章..."
                  class="form-textarea"
                  rows="12"
                ></textarea>
              </div>

              <p v-if="error" class="error-msg">{{ error }}</p>

              <div class="form-actions">
                <button type="submit" :disabled="postSubmitting" class="submit-btn">
                  {{ postSubmitting ? '发布中...' : '> 发布文章' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Comment Form -->
      <div v-if="activeTab === 'comment'" class="form-container">
        <div class="terminal-window">
          <div class="terminal-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="terminal-title">~/new-comment.md</span>
          </div>
          <div class="terminal-body">
            <form @submit.prevent="submitComment">
              <div class="form-group">
                <label>> 选择文章:</label>
                <select v-model="commentForm.postId" class="form-select">
                  <option value="">选择文章...</option>
                  <option v-for="post in posts" :key="post.id" :value="post.id">
                    {{ post.title }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>> 评论内容:</label>
                <textarea 
                  v-model="commentForm.content" 
                  placeholder="写下你的评论..."
                  class="form-textarea"
                  rows="6"
                ></textarea>
              </div>

              <p v-if="error" class="error-msg">{{ error }}</p>

              <div class="form-actions">
                <button type="submit" :disabled="commentSubmitting" class="submit-btn">
                  {{ commentSubmitting ? '提交中...' : '> 提交评论' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="postSuccess || commentSuccess" class="success-toast">
        ✓ {{ postSuccess ? '文章发布成功！' : '评论提交成功！' }}
      </div>

      <!-- Tips -->
      <div class="tips">
        <h3>// 快捷提示</h3>
        <ul>
          <li><code>#</code> 标题</li>
          <li><code>**粗体**</code></li>
          <li><code>*斜体*</code></li>
          <li><code>- 列表</code></li>
          <li><code>> 引用</code></li>
          <li><code>`代码`</code></li>
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

.terminal-title { margin-left: 10px; color: var(--text-dim); font-size: 0.85rem; }

.terminal-body { padding: 1.5rem; }
.terminal-body p { margin: 0.5rem 0; }

.prompt { color: #ff0055; }
.cmd { color: var(--text-secondary); }
.output { color: var(--text-primary); margin-top: 0.5rem; }

.login-form { display: flex; gap: 1rem; margin-top: 1rem; }

.password-input {
  flex: 1;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
}

.password-input:focus { outline: none; border-color: var(--accent); }

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

.error-msg { color: #ff0055; margin-top: 1rem; }

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
  margin-bottom: 1.5rem;
}

.admin-header h1 { color: var(--text-primary); }

.user-info { display: flex; align-items: center; gap: 1rem; }
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

.logout-btn:hover { border-color: #ff0055; color: #ff0055; }

/* Tabs */
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }

.tab-btn {
  padding: 0.8rem 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover { border-color: var(--text-primary); }

.tab-btn.active {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

/* Form */
.form-container { margin-bottom: 1.5rem; }

.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; color: var(--accent); margin-bottom: 0.5rem; }

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: var(--accent);
}

.form-textarea { resize: vertical; line-height: 1.6; }

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300ff41' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}

.form-actions { margin-top: 1rem; }

.submit-btn {
  padding: 1rem 2rem;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover { background: var(--accent-hover); box-shadow: 0 0 20px rgba(0, 255, 65, 0.4); }
.submit-btn:disabled { opacity: 0.5; }

/* Success Toast */
.success-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--accent);
  color: var(--bg-primary);
  border-radius: 8px;
  font-weight: 600;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Tips */
.tips {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.tips h3 { color: var(--text-primary); margin-bottom: 1rem; }

.tips ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.tips li { color: var(--text-secondary); }

.tips code {
  background: var(--bg-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--accent);
  margin-right: 0.5rem;
}
</style>
