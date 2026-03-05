<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const cursorVisible = ref(true)

onMounted(() => {
  setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="logo">
        <span class="bracket">&lt;</span>
        <span class="yz">yz</span>
        <span class="slash">/</span>
        <span class="bracket">&gt;</span>
        <span class="cursor" :class="{ visible: cursorVisible }">_</span>
      </div>
      <nav class="nav">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/blog" class="nav-link">Blog</RouterLink>
      </nav>
    </header>
    
    <main class="main">
      <RouterView />
    </main>
    
    <footer class="footer">
      <p>// Built with <span class="emoji">💻</span> and <span class="emoji">☕</span> by yz</p>
      <p class="copyright">© 2026 <span class="typing">while(alive) { code(); }</span></p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

@theme {
  --color-green-900: #008f11;
  --color-green-800: #00cc33;
  --color-green-700: #00ff41;
  --color-green-600: #33ff66;
  --color-pink-500: #ff0055;
}

:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #1a1a1a;
  --text-primary: #00ff41;
  --text-secondary: #00cc33;
  --text-dim: #008f11;
  --accent: #00ff41;
  --accent-hover: #33ff66;
  --border: #00ff4133;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  min-height: 100vh;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(180deg, transparent 0%, var(--bg-primary) 100%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.03) 2px,
      rgba(0, 255, 65, 0.03) 4px
    );
  pointer-events: none;
  z-index: -1;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.bracket { color: var(--text-dim); }
.yz { color: var(--text-primary); text-shadow: 0 0 10px var(--text-primary); }
.slash { color: #ff0055; }

.cursor {
  opacity: 0;
  color: var(--accent);
  margin-left: 2px;
}

.cursor.visible {
  opacity: 1;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::before {
  content: '// ';
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-link:hover {
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--accent);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}

.main {
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 0.85rem;
}

.footer p {
  margin: 0.3rem 0;
}

.emoji {
  font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
}

.typing {
  color: #ff0055;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--text-dim);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-primary);
}

::selection {
  background: var(--accent);
  color: var(--bg-primary);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>
