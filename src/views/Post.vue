<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, addComment, verifyAdmin } from '../services/github.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)

// Auth state
const isAuthenticated = ref(false)
const username = ref('')
const token = ref('')

// Comment form
const newComment = ref({ name: '', content: '' })
const showCommentForm = ref(false)
const commentSubmitting = ref(false)
const commentSuccess = ref(false)

const checkAuth = () => {
  const savedToken = localStorage.getItem('github_token')
  const savedUsername = localStorage.getItem('github_username')
  if (savedToken && savedUsername) {
    token.value = savedToken
    username.value = savedUsername
    isAuthenticated.value = true
  }
}

onMounted(async () => {
  checkAuth()
  post.value = await getPost(route.params.id)
  loading.value = false
  
  setTimeout(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  }, 100)
})

const goBack = () => router.push('/')

// 判断评论是否是作者
const isAuthor = (commentName) => {
  return post.value && commentName === post.value.author
}

// 获取 GitHub 评论链接
const getGitHubCommentLink = (commentId) => {
  return `https://github.com/YZranger/blog/issues/${route.params.id}#issuecomment-${commentId}`
}

const submitComment = async () => {
  if (!newComment.value.name || !newComment.value.content) return
  
  const commentToken = token.value || localStorage.getItem('github_token')
  if (!commentToken) {
    alert('请先在 /admin 登录 GitHub Token')
    router.push('/admin')
    return
  }
  
  commentSubmitting.value = true
  
  const result = await addComment(
    route.params.id,
    newComment.value.name,
    newComment.value.content,
    commentToken
  )
  
  commentSubmitting.value = false
  
  if (result.success) {
    commentSuccess.value = true
    newComment.value = { name: '', content: '' }
    showCommentForm.value = false
    // 刷新评论
    post.value = await getPost(route.params.id)
    setTimeout(() => commentSuccess.value = false, 2000)
  } else {
    alert('评论失败: ' + result.error)
  }
}

const renderContent = (content) => {
  if (!content) return ''
  
  let html = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const highlighted = hljs.highlight(code.trim(), { language }).value
    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
  })
  
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/^---$/gm, '<hr>')
  html = html.replace(/@(\w+)/g, '<a href="https://github.com/$1" target="_blank" class="mention">@$1</a>')
  
  html = html.split('\n').map(line => {
    if (line.match(/^<(h[1-3]|ul|ol|li|blockquote|hr|pre|div|p)/)) return line
    return line ? `<p>${line}</p>` : '<br>'
  }).join('')
  
  return html
}
</script>

<template>
  <div class="post-page" v-if="post">
    <button @click="goBack" class="back-btn">
      <span>&lt;</span>
      <span class="back-text">Back</span>
    </button>

    <article class="post">
      <header class="post-header">
        <div class="post-meta">
          <span class="date">{{ post.date }}</span>
          <span class="sep">|</span>
          <span class="author">@{{ post.author }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </header>

      <div class="post-content" v-html="renderContent(post.content)"></div>
    </article>

    <!-- Comments Section -->
    <section class="comments-section">
      <h2 class="comments-title">
        <span class="comment-icon">//</span> Comments ({{ post.comments?.length || 0 }})
      </h2>

      <div v-if="post.comments?.length > 0" class="comments-list">
        <div 
          v-for="comment in post.comments" 
          :key="comment.id" 
          class="comment"
          :class="{ 'is-author': isAuthor(comment.name) }"
        >
          <div class="comment-header">
            <div class="comment-author">
              <span class="comment-name">{{ comment.name }}</span>
              <span v-if="isAuthor(comment.name)" class="author-badge">作者</span>
            </div>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <p class="comment-content" v-html="renderContent(comment.content)"></p>
          <div class="comment-actions">
            <a :href="getGitHubCommentLink(comment.id)" target="_blank" class="reply-link">
              回复
            </a>
          </div>
        </div>
      </div>
      <div v-else class="no-comments">
        <p>> 暂无评论</p>
        <p class="hint">// 成为第一个评论的人！</p>
      </div>

      <!-- Inline Comment Form -->
      <div v-if="showCommentForm" class="comment-form">
        <div class="form-group">
          <label>> 你的名字:</label>
          <input 
            v-model="newComment.name" 
            type="text" 
            placeholder="Name..."
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>> 评论内容:</label>
          <textarea 
            v-model="newComment.content" 
            placeholder="Your message..."
            rows="4"
            class="form-textarea"
          ></textarea>
        </div>
        <div class="form-actions">
          <button @click="submitComment" :disabled="commentSubmitting" class="submit-btn">
            {{ commentSubmitting ? '提交中...' : '提交评论' }}
          </button>
          <button @click="showCommentForm = false" class="cancel-btn">取消</button>
        </div>
      </div>

      <div v-if="commentSuccess" class="success-msg">
        ✓ 评论提交成功！
      </div>

      <!-- Add Comment Button -->
      <button 
        v-if="!showCommentForm" 
        @click="showCommentForm = true" 
        class="add-comment-btn"
      >
        + 添加评论
      </button>
    </section>
  </div>

  <div v-else-if="loading" class="loading">
    <p>Loading<span class="pulse">...</span></p>
  </div>

  <div v-else class="not-found">
    <h1>404</h1>
    <p>> 文章未找到</p>
    <button @click="goBack">返回首页</button>
  </div>
</template>

<style scoped>
.post-page { max-width: 800px; margin: 0 auto; }

.back-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.3s;
}
.back-btn:hover { color: var(--accent); }
.back-text { margin-left: 0.5rem; }

.post {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.post-header { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
.post-meta { font-size: 0.9rem; margin-bottom: 0.8rem; }
.sep { margin: 0 0.5rem; color: var(--text-dim); }
.post-title { font-size: 2rem; color: var(--text-primary); margin-bottom: 0.8rem; }
.tags { display: flex; gap: 0.5rem; }
.tag { color: #ff0055; font-size: 0.85rem; }

.post-content { line-height: 1.8; color: var(--text-secondary); }
.post-content :deep(h1) { font-size: 1.8rem; color: var(--text-primary); margin: 1.5rem 0 0.8rem; }
.post-content :deep(h2) { font-size: 1.4rem; color: var(--text-primary); margin: 1.2rem 0 0.6rem; }
.post-content :deep(h3) { font-size: 1.2rem; color: var(--text-primary); margin: 1rem 0 0.5rem; }
.post-content :deep(p) { margin: 0.6rem 0; }
.post-content :deep(li) { margin-left: 1.5rem; margin: 0.4rem 0; }
.post-content :deep(.inline-code), .post-content :deep(code) { background: var(--bg-secondary); padding: 0.2rem 0.5rem; border-radius: 4px; color: var(--accent); font-size: 0.9em; }
.post-content :deep(pre) { margin: 1rem 0; border-radius: 6px; overflow: hidden; }
.post-content :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 1rem; margin: 1rem 0; color: var(--text-dim); font-style: italic; }
.post-content :deep(hr) { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.post-content :deep(a) { color: var(--accent); text-decoration: underline; }
.post-content :deep(.mention) { color: #58a6ff; }

.comments-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.comments-title { font-size: 1.2rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
.comment-icon { color: var(--accent); }

.comments-list { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }

.comment {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--border);
  transition: all 0.3s;
}

.comment.is-author {
  border-left-color: var(--accent);
  background: rgba(0, 255, 65, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.comment-author { display: flex; align-items: center; gap: 0.5rem; }
.comment-name { color: var(--accent); font-weight: 500; }

.author-badge {
  background: var(--accent);
  color: var(--bg-primary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.comment-date { color: var(--text-dim); }
.comment-content { color: var(--text-secondary); line-height: 1.6; }

.comment-actions { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); }
.reply-link { color: var(--text-dim); font-size: 0.8rem; text-decoration: none; transition: color 0.3s; }
.reply-link:hover { color: var(--accent); }

.no-comments { text-align: center; padding: 2rem; color: var(--text-dim); }
.hint { margin-top: 0.5rem; }

/* Comment Form */
.comment-form {
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.form-group { margin-bottom: 1rem; }
.form-group label { display: block; color: var(--accent); margin-bottom: 0.5rem; font-size: 0.9rem; }

.form-input, .form-textarea {
  width: 100%;
  padding: 0.8rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
}

.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--accent); }
.form-textarea { resize: vertical; }

.form-actions { display: flex; gap: 1rem; }

.submit-btn, .cancel-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn { background: var(--accent); color: var(--bg-primary); border: none; font-weight: 600; }
.submit-btn:hover { background: var(--accent-hover); }
.submit-btn:disabled { opacity: 0.5; }

.cancel-btn { background: transparent; border: 1px solid var(--border); color: var(--text-secondary); }
.cancel-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }

.success-msg {
  background: rgba(0, 255, 65, 0.1);
  color: var(--accent);
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}

.add-comment-btn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px dashed var(--border);
  color: var(--text-secondary);
  font-family: inherit;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
}
.add-comment-btn:hover { border-color: var(--accent); color: var(--accent); }

.loading { text-align: center; padding: 4rem; color: var(--text-primary); }
.pulse { animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.not-found { text-align: center; padding: 4rem 2rem; }
.not-found h1 { font-size: 4rem; color: var(--accent); margin-bottom: 1rem; }
.not-found p { color: var(--text-dim); margin-bottom: 2rem; }
.not-found button { padding: 0.8rem 2rem; background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; font-family: inherit; cursor: pointer; }
</style>
