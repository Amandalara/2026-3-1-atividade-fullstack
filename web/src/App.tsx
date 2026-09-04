import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar"><a className="brand" href="/" aria-label="Página inicial do diatinf x"><span className="brand-mark">dx</span><span>diatinf x</span></a><a className="profile-button" href="/perfil" aria-label="Abrir perfil">AL</a></header>
      <main>
        <section className="welcome"><p className="eyebrow">COMUNIDADE INFOWEB</p><h1>O que está acontecendo por aqui?</h1><a href="/nova-publicacao" className="primary-button" role="button" aria-label="Criar nova publicação">+ Nova publicação</a></section>
        <nav className="quick-links" aria-label="Navegação principal"><a className="active" href="/">Início</a><a href="/nova-publicacao">Nova publicação</a><a href="/minhas-publicacoes">Minhas publicações</a><a href="/perfil">Perfil</a></nav>
        <section className="search-bar"><input type="search" className="search-input" placeholder="Pesquisar publicações..." aria-label="Campo de pesquisa de publicações" /></section>
        <section className="feed" aria-label="Publicações recentes">
          <article className="post-card"><div className="post-author"><span className="avatar coral">MC</span><div><strong>Marina Costa</strong><small>há 12 min</small></div></div><p>Que projeto incrível estamos construindo juntos! Mal posso esperar para ver o diatinf x crescendo.</p><div className="post-actions"><button type="button">☆ 0</button><button type="button">♡ 4</button><button type="button">↩ Comentar</button></div></article>
          <article className="post-card"><div className="post-author"><span className="avatar green">JP</span><div><strong>João Pedro</strong><small>há 1 h</small></div></div><p>Alguém já experimentou uma paleta de cores diferente para o trabalho? Estou buscando referências.</p><div className="post-actions"><button type="button">☆ 0</button><button type="button">♡ 7</button><button type="button">↩ 2 comentários</button></div></article>
        </section>
      </main>
      <footer>diatinf x <span>•</span> feito pela comunidade</footer>
    </div>
  )
}

export default App
