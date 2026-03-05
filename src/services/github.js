// GitHub Issues API 服务
// 用于从 GitHub Issues 获取文章和评论

const REPO_OWNER = 'YZranger'
const REPO_NAME = 'blog'

// 获取所有文章（标签为 article 的 issues）
export async function getPosts() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=article&state=open&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'yz-blog'
        }
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch posts')
    
    const issues = await response.json()
    
    return issues.map(issue => ({
      id: issue.number.toString(),
      title: issue.title,
      date: issue.created_at.split('T')[0],
      author: issue.user.login,
      tags: issue.labels.map(l => l.name).filter(l => l !== 'article'),
      content: issue.body || '',
      commentsCount: issue.comments
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// 获取单篇文章和评论
export async function getPost(postId) {
  try {
    const issueResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${postId}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'yz-blog'
        }
      }
    )
    
    if (!issueResponse.ok) throw new Error('Failed to fetch post')
    
    const issue = await issueResponse.json()
    
    // 获取评论
    const commentsResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${postId}/comments?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'yz-blog'
        }
      }
    )
    
    const comments = commentsResponse.ok ? await commentsResponse.json() : []
    
    return {
      id: issue.number.toString(),
      title: issue.title,
      date: issue.created_at.split('T')[0],
      author: issue.user.login,
      tags: issue.labels.map(l => l.name).filter(l => l !== 'article'),
      content: issue.body || '',
      comments: comments.map(c => ({
        id: c.id,
        name: c.user.login,
        content: c.body,
        date: c.created_at.split('T')[0]
      }))
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// 获取所有评论
export async function getComments(postId) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${postId}/comments?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'yz-blog'
        }
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch comments')
    
    const comments = await response.json()
    return comments.map(c => ({
      id: c.id,
      name: c.user.login,
      content: c.body,
      date: c.created_at.split('T')[0]
    }))
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

// 创建文章（需要 GitHub Token）
export async function createPost(title, content, tags = [], token) {
  try {
    const labels = ['article', ...tags].join(',')
    
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`,
          'User-Agent': 'yz-blog'
        },
        body: JSON.stringify({
          title,
          body: content,
          labels
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create post')
    }
    
    const issue = await response.json()
    return { success: true, id: issue.number.toString() }
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, error: error.message }
  }
}

// 添加评论
export async function addComment(postId, name, content, token) {
  try {
    const body = `**${name}**:\n\n${content}`
    
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${postId}/comments`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`,
          'User-Agent': 'yz-blog'
        },
        body: JSON.stringify({ body })
      }
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add comment')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error adding comment:', error)
    return { success: false, error: error.message }
  }
}

// 验证管理员（通过 GitHub API）
export async function verifyAdmin(token) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'yz-blog'
      }
    })
    
    if (!response.ok) return { valid: false, error: 'Invalid token' }
    
    const user = await response.json()
    // 这里可以添加白名单检查
    const allowedUsers = ['YZranger'] // 添加允许的用户名
    
    return { 
      valid: allowedUsers.includes(user.login),
      username: user.login
    }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}
