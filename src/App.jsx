import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import { ToastProvider } from './components/admin/ToastProvider.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useTheme } from './components/ThemeProvider.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import AdminProjects from './pages/AdminProjects.jsx';
import AdminProjectForm from './pages/AdminProjectForm.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import AdminTags from './pages/AdminTags.jsx';
import PublicProjects from './pages/PublicProjects.jsx';
import PublicProjectPage from './pages/PublicProjectPage.jsx';
import RoadmapPage from './pages/admin/RoadmapPage.jsx';

export default function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isAdminRoute
          ? 'bg-zinc-950 text-zinc-100'
          : theme === 'light'
            ? 'theme-light bg-[#f7f8f2] text-slate-900'
            : 'bg-zinc-950 text-zinc-100'
      }`}
      data-theme={isAdminRoute ? 'dark' : theme}
    >
      <ToastProvider>
        {!isAdminRoute && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mods/:slug" element={<PublicProjectPage />} />
            <Route path="/projects" element={<PublicProjects />} />
            <Route path="/projects/:slug" element={<PublicProjectPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/unauthorized" element={<Unauthorized />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedAdminRoute>
                  <AdminProjects />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/projects/new"
              element={
                <ProtectedAdminRoute>
                  <AdminProjectForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/projects/:id/edit"
              element={
                <ProtectedAdminRoute>
                  <AdminProjectForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/projects/categories"
              element={
                <ProtectedAdminRoute>
                  <AdminCategories />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/projects/tags"
              element={
                <ProtectedAdminRoute>
                  <AdminTags />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/roadmap"
              element={
                <ProtectedAdminRoute>
                  <RoadmapPage />
                </ProtectedAdminRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </ToastProvider>
    </div>
  );
}
