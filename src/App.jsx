import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import ModPage from './pages/ModPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useTheme } from './components/ThemeProvider.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

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
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mods/:id" element={<ModPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
