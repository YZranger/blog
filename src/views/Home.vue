<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts } from '../services/github.js'

const router = useRouter()

const posts = ref([])
const loading = ref(true)
const searchQuery = ref('')

onMounted(async () => {
  posts.value = await getPosts()
  loading.value = false
})

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

const goToPost = (id) => {
  router.push(`/post/${id}`)
}

const goToAdmin = () => {
  router.push('/admin')
}
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-terminal">
        <div class="terminal-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="terminal-title">~/blog</span>
        </div>
        <div class="terminal-body">
          <p><span class="prompt">$</span> <span class="cmd">whoami</span></p>
          <p class="output">yz - 疯狂的程序员 🚀</p>
          <p><span class="prompt">$</span> <span class="cmd">cat skills.json</span></p>
          <p class="output">[JavaScript, Python, Rust, Go, Vue.js ...]</p>
          <p><span class="prompt">$</span> <span class="cmd">echo $MOTTO</span></p>
          <p class="output">"Code is poetry, bugs are features"</p>
          <p><span class="prompt">$</span> <span class="blink">_</span></p>
        </div>
      </div>
    </div>

    <!-- Admin Button -->
    <div class="admin-bar">
      <button @click="goToAdmin" class="admin-btn">
        <span>✍️</span> 写文章
      </button>
    </div>

    <!-- Search -->
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="// 搜索文章或标签..."
        class="search-input"
      />
      <span class="search-prompt">></span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <p>Loading<span class="pulse">...</span></p>
    </div>

    <!-- Posts Grid -->
    <div v-else class="posts-grid">
      <article 
        v-for="(post, index) in filteredPosts" 
        :key="post.id" 
        class="post-card"
        @click="goToPost(post.id)"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="post-header">
          <span class="post-date">{{ post.date }}</span>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-preview">
          {{ post.content.substring(0, 150).replace(/[#*`\n]/g, ' ').trim() }}...
        </p>
        <div class="post-footer">
          <span class="author"><span class="at">@</span>{{ post.author }}</span>
          <span class="read-more">Read More <span class="arrow">>></span></span>
        </div>
      </article>
    </div>

    <div v-if="!loading && filteredPosts.length === 0" class="no-results">
      <p>> 暂无文章</p>
      <p class="hint">// 点击右上角「写文章」发布第一篇！</p>
    </div>
  </div>
</template>

<style scoped>
.home { padding-top: 1rem; }

.hero { margin-bottom: 2rem; }

.hero-terminal {
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 0 40px rgba(0, 255, 65, 0.1);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
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

.terminal-body {
  padding: 1.5rem 2rem;
  font-size: 1rem;
  line-height: 1.8;
}

.terminal-body p { margin: 0.3rem 0; }
.prompt { color: #ff0055; margin-right: 10px; }
.cmd { color: var(--text-secondary); }
.output { color: var(--text-primary); padding-left: 1rem; }
.blink { animation: blink 1s infinite; color: var(--accent); }

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.admin-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.admin-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid var(--accent);
  border-radius: 6px;
  color: var(--accent);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.admin-btn:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  margin-bottom: 2rem;
  transition: all 0.3s;
}

.search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder { color: var(--text-dim); }
.search-prompt { color: var(--accent); }

.loading { text-align: center; padding: 3rem; color: var(--text-primary); }
.pulse { animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.post-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent);
  box-shadow: 0 10px 30px rgba(0, 255, 65, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-date { color: var(--text-dim); font-size: 0.85rem; }
.post-tags { display: flex; gap: 0.5rem; }
.tag { color: #ff0055; font-size: 0.8rem; }

.post-title { color: var(--text-primary); font-size: 1.3rem; margin-bottom: 0.8rem; }
.post-card:hover .post-title { color: var(--accent); }

.post-preview { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem; }

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.author { color: var(--text-dim); font-size: 0.85rem; }
.at { color: var(--accent); }

.read-more { color: var(--accent); font-size: 0.85rem; transition: transform 0.3s; }
.post-card:hover .read-more { transform: translateX(5px); }

.no-results { text-align: center; padding: 3rem; color: var(--text-dim); }
.hint { margin-top: 1rem; }

@media (max-width: 768px) {
  .posts-grid { grid-template-columns: 1fr; }
}
</style>
