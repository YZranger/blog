import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blog from '../views/Blog.vue'
import Post from '../views/Post.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/blog', name: 'Blog', component: Blog },
  { path: '/post/:id', name: 'Post', component: Post }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
