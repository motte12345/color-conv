import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nProvider } from './i18n'
import { Layout } from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const PalettePage = lazy(() => import('./pages/PalettePage'))
const GradientPage = lazy(() => import('./pages/GradientPage'))
const ContrastPage = lazy(() => import('./pages/ContrastPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

export function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="loading">...</div>}>
          <Routes>
            {/* / → /ja/ */}
            <Route index element={<Navigate to="/ja/" replace />} />

            {/* 旧パスのリダイレクト */}
            <Route path="palette" element={<Navigate to="/ja/palette" replace />} />
            <Route path="gradient" element={<Navigate to="/ja/gradient" replace />} />
            <Route path="contrast" element={<Navigate to="/ja/contrast" replace />} />
            <Route path="about" element={<Navigate to="/ja/about" replace />} />

            {/* 言語プレフィックス付きルート */}
            <Route path=":lang" element={<I18nProvider><Layout /></I18nProvider>}>
              <Route index element={<HomePage />} />
              <Route path="palette" element={<PalettePage />} />
              <Route path="gradient" element={<GradientPage />} />
              <Route path="contrast" element={<ContrastPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>

            {/* その他 → /ja/ */}
            <Route path="*" element={<Navigate to="/ja/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  )
}
