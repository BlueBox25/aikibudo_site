import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import { useContent } from './context/useContent'
import { ErrorState, LoadingState } from './ui'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import Disciplines from './pages/Disciplines'
import DisciplineDetail from './pages/DisciplineDetail'
import Instructors from './pages/Instructors'
import Resources from './pages/Resources'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

/**
 * Dev-only content editor. `import.meta.env.DEV` is replaced by a literal at
 * build time, so the dynamic import sits in dead code and Rollup drops the
 * whole admin chunk from production.
 */
const AdminPage = import.meta.env.DEV ? lazy(() => import('./admin/AdminPage')) : null

/**
 * Every page reads from the same content document, so the fetch is gated once
 * here rather than repeated per route.
 */
function Gate({ children }) {
  const { loading, error, reload } = useContent()

  if (loading) return <LoadingState />
  if (error) {
    return (
      <ErrorState
        message={`Nu am putut încărca datele site-ului. ${error.message}`}
        onRetry={reload}
      />
    )
  }
  return children
}

export default function App() {
  return (
    <ContentProvider>
      <Gate>
        <Routes>
          {AdminPage && (
            <Route
              path="admin"
              element={
                <Suspense fallback={<LoadingState />}>
                  <AdminPage />
                </Suspense>
              }
            />
          )}

          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="locatii" element={<Locations />} />
            <Route path="locatii/:slug" element={<LocationDetail />} />
            <Route path="discipline" element={<Disciplines />} />
            <Route path="discipline/:slug" element={<DisciplineDetail />} />
            <Route path="instructori" element={<Instructors />} />
            <Route path="resurse" element={<Resources />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Gate>
    </ContentProvider>
  )
}
