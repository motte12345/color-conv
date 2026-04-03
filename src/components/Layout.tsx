import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLang, useT, langPath } from '../i18n'
import type { Lang } from '../i18n'

export function Layout() {
  const location = useLocation()
  const lang = useLang()
  const t = useT()

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      })
    }
  }, [location.pathname])

  const navItems = [
    { to: langPath(lang, '/'), label: t.common.nav.converter },
    { to: langPath(lang, '/palette'), label: t.common.nav.palette },
    { to: langPath(lang, '/gradient'), label: t.common.nav.gradient },
    { to: langPath(lang, '/contrast'), label: t.common.nav.contrast },
  ] as const

  // 言語切替: 現在のパスから言語部分だけ差し替え
  const otherLang: Lang = lang === 'ja' ? 'en' : 'ja'
  const switchPath = location.pathname.replace(`/${lang}`, `/${otherLang}`) + location.search

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1 className="site-header__title">
            <Link to={langPath(lang, '/')}>{t.common.siteTitle}</Link>
          </h1>
          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === langPath(lang, '/')}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to={switchPath} className="lang-switch" aria-label={`Switch to ${otherLang === 'ja' ? '日本語' : 'English'}`}>
            {otherLang === 'ja' ? 'JA' : 'EN'}
          </Link>
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
            {t.common.siteTitle} —{' '}
            <Link to={langPath(lang, '/about')}>{t.common.footer}</Link>
          </p>
        </div>
      </footer>
    </>
  )
}
