import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Comment = {
  id: number
  author: string
  content: string
  replies: Comment[]
}

type Post = {
  id: number
  authorId: number
  authorName: string
  content: string
  createdAt: string
  averageRating: number
  totalRatings: number
  comments: Comment[]
}

type User = {
  id: number
  name: string
  login: string
}

const API_URL = '/api'

const formatDate = (value: string) => {
  const date = new Date(value)

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [loginForm, setLoginForm] = useState({ login: 'amanda', password: '1234' })
  const [newPost, setNewPost] = useState('')
  const [error, setError] = useState('')

  const myPosts = useMemo(
    () => (user ? posts.filter((post) => post.authorId === user.id) : []),
    [posts, user],
  )

  const fetchPosts = async (term = '') => {
    const query = term ? `?search=${encodeURIComponent(term)}` : ''
    const response = await fetch(`${API_URL}/posts${query}`)

    if (!response.ok) {
      throw new Error('Não foi possível carregar as publicações.')
    }

    const data = (await response.json()) as Post[]
    setPosts(data)
  }

  useEffect(() => {
    fetchPosts(search).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar publicações.')
    })
  }, [search])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ message: 'Erro ao autenticar.' }))) as { message?: string }
      setError(payload.message ?? 'Erro ao autenticar.')
      return
    }

    const payload = (await response.json()) as { user: User }
    setUser(payload.user)
  }

  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user || !newPost.trim()) {
      setError('Escreva algo antes de publicar.')
      return
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: user.id, content: newPost }),
    })

    if (!response.ok) {
      setError('Não foi possível criar a publicação.')
      return
    }

    setNewPost('')
    setError('')
    await fetchPosts(search)
  }

  const handleRate = async (postId: number, stars: number) => {
    if (!user) {
      setError('Faça login para avaliar uma publicação.')
      return
    }

    const response = await fetch(`${API_URL}/posts/${postId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, stars }),
    })

    if (!response.ok) {
      setError('Não foi possível registrar a avaliação.')
      return
    }

    setError('')
    await fetchPosts(search)
  }

  const handleComment = async (postId: number, content: string, parentId?: number) => {
    if (!user || !content.trim()) {
      setError('Escreva o comentário antes de enviar.')
      return
    }

    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: user.name,
        content,
        parentId,
      }),
    })

    if (!response.ok) {
      setError('Não foi possível enviar o comentário.')
      return
    }

    setError('')
    await fetchPosts(search)
  }

  const renderComments = (comments: Comment[], postId: number) => {
    return comments.map((comment) => (
      <div key={comment.id} className="comment-item">
        <div className="comment-header">
          <strong>{comment.author}</strong>
        </div>
        <p>{comment.content}</p>
        <div className="comment-replies">
          {comment.replies.length > 0 && renderComments(comment.replies, postId)}
        </div>
      </div>
    ))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Página inicial do diatinf x">
          <span className="brand-mark">dx</span>
          <span>diatinf x</span>
        </a>

        <div className="profile-chip">
          {user ? <span>{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span> : <span>AI</span>}
        </div>
      </header>

      <main>
        <section className="welcome">
          <p className="eyebrow">COMUNIDADE INFOWEB</p>
          <h1>O que está acontecendo por aqui?</h1>
          <p className="welcome-copy">Conecte-se, compartilhe ideias e acompanhe o que a turma está falando.</p>
        </section>

        <nav className="quick-links" aria-label="Navegação principal">
          <a className="active" href="#">Início</a>
          <a href="#feed">Feed</a>
          <a href="#minhas-publicacoes">Minhas publicações</a>
          <a href="#perfil">Perfil</a>
        </nav>

        <section className="search-bar">
          <input
            type="search"
            className="search-input"
            placeholder="Pesquisar publicações..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Campo de pesquisa de publicações"
          />
        </section>

        <section className="panel-grid">
          <div className="panel auth-panel">
            {user ? (
              <>
                <h2>Perfil</h2>
                <div className="profile-box">
                  <span className="avatar avatar-large">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>@{user.login}</small>
                  </div>
                </div>
                <button type="button" className="secondary-button" onClick={() => setUser(null)}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <h2>Entrar</h2>
                <form onSubmit={handleLogin} className="auth-form">
                  <label>
                    Login
                    <input
                      type="text"
                      value={loginForm.login}
                      onChange={(event) => setLoginForm((current) => ({ ...current, login: event.target.value }))}
                    />
                  </label>
                  <label>
                    Senha
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    />
                  </label>
                  <button type="submit" className="primary-button">Entrar</button>
                </form>
                <p className="hint">Acesso demo: amanda / 1234</p>
              </>
            )}
          </div>

          <div className="panel composer-panel">
            <h2>Nova publicação</h2>
            <form onSubmit={handleCreatePost} className="composer-form">
              <textarea
                value={newPost}
                onChange={(event) => setNewPost(event.target.value)}
                rows={4}
                placeholder={user ? 'Compartilhe algo com a comunidade...' : 'Faça login para publicar'}
                disabled={!user}
              />
              <button type="submit" className="primary-button" disabled={!user}>
                Publicar
              </button>
            </form>
          </div>
        </section>

        {error && <p className="error-banner">{error}</p>}

        <section id="feed" className="feed" aria-label="Publicações recentes">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-author">
                <span className="avatar avatar-green">{post.authorName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                <div>
                  <strong>{post.authorName}</strong>
                  <small>{formatDate(post.createdAt)}</small>
                </div>
              </div>

              <p>{post.content}</p>

              <div className="post-meta">
                <span>⭐ {post.averageRating || 0} ({post.totalRatings})</span>
                <span>{post.comments.length} comentário(s)</span>
              </div>

              <div className="rating-row">
                {[1, 2, 3].map((value) => (
                  <button key={value} type="button" className="rate-button" onClick={() => handleRate(post.id, value)}>
                    {value}★
                  </button>
                ))}
              </div>

              <div className="comment-list">{renderComments(post.comments, post.id)}</div>

              <form
                className="comment-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  const commentValue = String(formData.get('comment') ?? '')
                  void handleComment(post.id, commentValue)
                  event.currentTarget.reset()
                }}
              >
                <input type="text" name="comment" placeholder="Adicionar comentário" aria-label="Adicionar comentário" />
                <button type="submit">Comentar</button>
              </form>
            </article>
          ))}
        </section>

        <section id="minhas-publicacoes" className="panel my-posts-panel">
          <h2>Minhas publicações</h2>
          {user ? (
            myPosts.length > 0 ? (
              <ul>
                {myPosts.map((post) => (
                  <li key={post.id}>{post.content}</li>
                ))}
              </ul>
            ) : (
              <p>Você ainda não publicou nenhuma mensagem.</p>
            )
          ) : (
            <p>Faça login para visualizar suas publicações.</p>
          )}
        </section>
      </main>

      <footer>diatinf x <span>•</span> feito pela comunidade</footer>
    </div>
  )
}

export default App
