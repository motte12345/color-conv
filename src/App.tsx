import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
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
        <Suspense fallback={<div className="loading">読み込み中...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="palette" element={<PalettePage />} />
              <Route path="gradient" element={<GradientPage />} />
              <Route path="contrast" element={<ContrastPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  )
}
