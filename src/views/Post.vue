<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost } from '../services/github.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)

const newComment = ref({ name: '', content: '' })
const showCommentForm = ref(false)
const commentSuccess = ref(false)

onMounted(async () => {
  post.value = await getPost(route.params.id)
  loading.value = false
  
  setTimeout(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  }, 100)
})

const goBack = () => router.push('/blog')

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
      <span class="arrow-icon">&lt;</span>
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
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <span class="comment-name">{{ comment.name }}</span>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <p class="comment-content" v-html="renderContent(comment.content)"></p>
        </div>
      </div>
      <div v-else class="no-comments">
        <p>> 暂无评论</p>
        <p class="hint">// 成为第一个评论的人！</p>
      </div>
    </section>
  </div>

  <div v-else-if="loading" class="loading">
    <p>Loading<span class="pulse">...</span></p>
  </div>

  <div v-else class="not-found">
    <h1>404</h1>
    <p>> 文章未找到</p>
    <button @click="goBack">返回博客</button>
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
.post-content :deep(a:hover) { text-decoration: none; }

.comments-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.comments-title { font-size: 1.2rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
.comment-icon { color: var(--accent); }

.comments-list { display: flex; flex-direction: column; gap: 0.8rem; }
.comment { background: var(--bg-secondary); padding: 1rem; border-radius: 6px; border-left: 3px solid var(--border); }
.comment-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; }
.comment-name { color: var(--accent); }
.comment-date { color: var(--text-dim); }
.comment-content { color: var(--text-secondary); line-height: 1.6; }

.no-comments { text-align: center; padding: 2rem; color: var(--text-dim); }
.hint { margin-top: 0.5rem; }

.loading { text-align: center; padding: 4rem; color: var(--text-primary); }
.pulse { animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.not-found { text-align: center; padding: 4rem 2rem; }
.not-found h1 { font-size: 4rem; color: var(--accent); margin-bottom: 1rem; }
.not-found p { color: var(--text-dim); margin-bottom: 2rem; }
.not-found button { padding: 0.8rem 2rem; background: var(--accent); color: var(--bg-primary); border: none; border-radius: 6px; font-family: inherit; cursor: pointer; }
</style>
