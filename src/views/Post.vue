<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { posts, comments, addComment } from '../data/posts.js'

const route = useRoute()
const router = useRouter()

const post = computed(() => posts.find(p => p.id === route.params.id))

const postComments = computed(() => 
  comments.filter(c => c.postId === route.params.id)
)

const newComment = ref({ name: '', content: '' })
const showCommentForm = ref(false)
const commentSuccess = ref(false)

const submitComment = () => {
  if (!newComment.value.name || !newComment.value.content) return
  
  addComment(route.params.id, newComment.value.name, newComment.value.content)
  newComment.value = { name: '', content: '' }
  showCommentForm.value = false
  commentSuccess.value = true
  setTimeout(() => commentSuccess.value = false, 3000)
}

const goBack = () => {
  router.push('/')
}

// Simple markdown-like rendering
const renderContent = (content) => {
  if (!content) return ''
  
  return content
    .split('\n')
    .map(line => {
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('> ')) return `<blockquote>${line.slice(2)}</blockquote>`
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
      if (line.startsWith('```')) return ''
      if (line.trim() === '---') return '<hr>'
      if (line.startsWith('**') && line.endsWith('**')) 
        return `<strong>${line.slice(2, -2)}</strong>`
      if (line.includes('`')) {
        return line.replace(/`([^`]+)`/g, '<code>$1</code>')
      }
      return line ? `<p>${line}</p>` : '<br>'
    })
    .join('')
}
</script>

<template>
  <div class="post-page" v-if="post">
    <button class="back-btn" @click="goBack">
      < <span class="back-text">Back</span>
    </button>

    <article class="post">
      <header class="post-header">
        <div class="post-meta">
          <span class="date">{{ post.date }}</span>
          <span class="separator">|</span>
          <span class="author">@{{ post.author }}</span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </header>

      <div class="post-content" v-html="renderContent(post.content)"></div>
    </article>

    <section class="comments-section">
      <h2 class="comments-title">
        <span class="comment-icon">//</span> Comments ({{ postComments.length }})
      </h2>

      <div class="comments-list" v-if="postComments.length > 0">
        <div v-for="comment in postComments" :key="comment.id" class="comment">
          <div class="comment-header">
            <span class="comment-name">{{ comment.name }}</span>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
      <div v-else class="no-comments">
        <p>> 暂无评论</p>
        <p class="hint">// 成为第一个评论的人！</p>
      </div>

      <div v-if="commentSuccess" class="success-msg">
        ✓ 评论已提交！
      </div>

      <button 
        v-if="!showCommentForm" 
        class="add-comment-btn"
        @click="showCommentForm = true"
      >
        + Add Comment
      </button>

      <form v-if="showCommentForm" class="comment-form" @submit.prevent="submitComment">
        <div class="form-group">
          <label>> 你的名字:</label>
          <input 
            v-model="newComment.name" 
            type="text" 
            placeholder="Name..."
            required
          />
        </div>
        <div class="form-group">
          <label>> 留言内容:</label>
          <textarea 
            v-model="newComment.content" 
            placeholder="Your message..."
            rows="4"
            required
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Submit</button>
          <button type="button" class="cancel-btn" @click="showCommentForm = false">Cancel</button>
        </div>
      </form>
    </section>
  </div>

  <div v-else class="not-found">
    <h1>404</h1>
    <p>> 文章未找到</p>
    <button @click="goBack">返回首页</button>
  </div>
</template>

<style scoped>
.post-page {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 1rem;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  transition: color 0.3s;
}

.back-btn:hover {
  color: var(--accent);
}

.back-text {
  margin-left: 0.5rem;
}

.post {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 3rem;
}

.post-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.post-meta {
  color: var(--text-dim);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.separator {
  margin: 0 0.5rem;
}

.post-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
}

.tags {
  display: flex;
  gap: 0.8rem;
}

.tag {
  color: #ff0055;
  font-size: 0.85rem;
}

.post-content {
  line-height: 1.8;
  color: var(--text-secondary);
}

.post-content :deep(h1) {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 2rem 0 1rem;
}

.post-content :deep(h2) {
  font-size: 1.4rem;
  color: var(--text-primary);
  margin: 1.5rem 0 1rem;
}

.post-content :deep(h3) {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 1rem 0 0.5rem;
}

.post-content :deep(p) {
  margin: 0.8rem 0;
}

.post-content :deep(li) {
  margin-left: 1.5rem;
  margin: 0.5rem 0;
}

.post-content :deep(code) {
  background: var(--bg-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--accent);
  font-size: 0.9em;
}

.post-content :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--text-dim);
  font-style: italic;
}

.post-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.post-content :deep(strong) {
  color: var(--text-primary);
}

.comments-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2rem;
}

.comments-title {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-icon {
  color: var(--accent);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comment {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--border);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.comment-name {
  color: var(--accent);
}

.comment-date {
  color: var(--text-dim);
}

.comment-content {
  color: var(--text-secondary);
  line-height: 1.6;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--text-dim);
}

.hint {
  margin-top: 0.5rem;
}

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
  font-family: var(--font-mono);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
}

.add-comment-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.comment-form {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: var(--accent);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 0.8rem;
  border-radius: 6px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn {
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  font-weight: 600;
}

.submit-btn:hover {
  background: var(--accent-hover);
}

.cancel-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.cancel-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 4rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.not-found p {
  color: var(--text-dim);
  margin-bottom: 2rem;
}

.not-found button {
  padding: 0.8rem 2rem;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 6px;
  font-family: var(--font-mono);
  cursor: pointer;
}
</style>