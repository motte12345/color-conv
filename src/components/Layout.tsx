import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: '変換' },
  { to: '/palette', label: '配色' },
  { to: '/gradient', label: 'グラデーション' },
  { to: '/contrast', label: 'コントラスト' },
] as const

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      })
    }
  }, [location.pathname])

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1 className="site-header__title">
            <Link to="/">カラー変換ツール</Link>
          </h1>
          <nav className="site-nav" aria-label="メインナビゲーション">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            カラー変換ツール —{' '}
            <Link to="/about">概要・免責事項</Link>
          </p>
        </div>
      </footer>
    </>
  )
}
