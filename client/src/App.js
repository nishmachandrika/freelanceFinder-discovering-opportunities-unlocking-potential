import './App.css';
import { Route, Routes } from 'react-router-dom';
import { GeneralContextProvider } from './context/GeneralContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Authenticate from './pages/Authenticate';
import FreelancerRoutes from './pages/freelancer/FreelancerRoutes';
import ClientRoutes from './pages/client/ClientRoutes';

import AdminRoutes from './pages/admin/AdminRoutes' // Add .jsx extension
import ProtectedRoute from './components/ProtectedRoute'; // Suggested addition
import NotFound from './pages/NotFound'; // Suggested addition

function App() {
  return (
    <GeneralContextProvider>
      <div className="app-container">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/authenticate" element={<Authenticate />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
              <Route path="/freelancer/*" element={<FreelancerRoutes />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['client']} />}>
              <Route path="/client/*" element={<ClientRoutes />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>

            {/* 404 Handler */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Optional Footer */}
        <footer className="app-footer">
          {/* Footer content */}
        </footer>
      </div>
    </GeneralContextProvider>
  );
}

export default App;