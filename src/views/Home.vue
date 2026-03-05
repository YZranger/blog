<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentLine = ref(0)
const showCursor = ref(true)

const lines = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: 'yz - 疯狂的程序员' },
  { type: 'command', text: 'cat ~/skills.json' },
  { type: 'output', text: '["JavaScript", "Python", "Rust", "Go", "Vue.js", "..."]' },
  { type: 'command', text: 'echo $MOTTO' },
  { type: 'output', text: '"Code is poetry, bugs are features"' },
  { type: 'command', text: 'start --blog' },
  { type: 'output', text: 'Initializing blog system...' },
  { type: 'output', text: 'Blog ready! 🚀' },
]

onMounted(() => {
  // Typing animation
  const interval = setInterval(() => {
    if (currentLine.value < lines.length - 1) {
      currentLine.value++
    } else {
      clearInterval(interval)
    }
  }, 400)

  // Cursor blink
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 530)
})

const goToBlog = () => {
  router.push('/blog')
}
</script>

<template>
  <div class="home">
    <!-- Hero Terminal -->
    <div class="hero">
      <div class="hero-terminal">
        <div class="terminal-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="terminal-title">~/home</span>
        </div>
        <div class="terminal-body">
          <template v-for="(line, index) in lines" :key="index">
            <div v-if="index <= currentLine" class="line" :class="line.type">
              <span v-if="line.type === 'command'" class="prompt">$</span>
              <span :class="{ typing: line.type === 'output' && index === currentLine }">
                {{ line.text }}
              </span>
            </div>
          </template>
          <div class="line">
            <span class="prompt">$</span>
            <span class="cursor" :class="{ visible: showCursor }">_</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Button -->
    <div class="cta-section">
      <button @click="goToBlog" class="cta-button">
        <span class="btn-text">Enter Blog</span>
        <span class="btn-arrow">>></span>
      </button>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <a href="https://github.com/YZranger/blog" target="_blank" class="link-card">
        <span class="link-icon">⭐</span>
        <span class="link-text">GitHub</span>
      </a>
      <a href="https://github.com/YZranger/blog/issues/new" target="_blank" class="link-card">
        <span class="link-icon">✍️</span>
        <span class="link-text">Write Post</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.hero {
  width: 100%;
  max-width: 700px;
  margin-bottom: 3rem;
}

.hero-terminal {
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 
    0 0 40px rgba(0, 255, 65, 0.1),
    0 0 80px rgba(0, 255, 65, 0.05);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.dot {
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
  padding: 1.5rem 2rem;
  font-size: 1rem;
  line-height: 2;
}

.line {
  margin: 0.3rem 0;
}

.line.command {
  color: var(--text-secondary);
}

.line.output {
  color: var(--text-primary);
  padding-left: 1rem;
}

.prompt {
  color: #ff0055;
  margin-right: 10px;
}

.cursor {
  display: inline-block;
  opacity: 0;
  color: var(--accent);
}

.cursor.visible {
  opacity: 1;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.typing::after {
  content: '|';
  animation: typing 0.5s infinite;
  color: var(--accent);
}

@keyframes typing {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cta-section {
  margin-bottom: 3rem;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2.5rem;
  background: transparent;
  border: 2px solid var(--accent);
  border-radius: 8px;
  color: var(--accent);
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
}

.cta-button:hover {
  background: var(--accent);
  color: var(--bg-primary);
  box-shadow: 0 0 40px rgba(0, 255, 65, 0.4);
  transform: translateY(-2px);
}

.btn-arrow {
  transition: transform 0.3s;
}

.cta-button:hover .btn-arrow {
  transform: translateX(5px);
}

.quick-links {
  display: flex;
  gap: 1.5rem;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-card:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.link-icon {
  font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
}

@media (max-width: 768px) {
  .terminal-body {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .quick-links {
    flex-direction: column;
    width: 100%;
  }
  
  .link-card {
    justify-content: center;
  }
}
</style>
