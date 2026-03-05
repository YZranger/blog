// GitHub Issues API 服务（只读）
const REPO_OWNER = 'YZranger'
const REPO_NAME = 'blog'

const getHeaders = () => ({
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'yz-blog'
})

// 获取所有文章（标签为 article 的 issues）
export async function getPosts() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=article&state=open&per_page=100`,
      { headers: getHeaders() }
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
      { headers: getHeaders() }
    )
    
    if (!issueResponse.ok) throw new Error('Failed to fetch post')
    
    const issue = await issueResponse.json()
    
    const commentsResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${postId}/comments?per_page=100`,
      { headers: getHeaders() }
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