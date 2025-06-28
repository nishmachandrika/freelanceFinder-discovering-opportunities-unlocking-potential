import { Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import AdminProjects from './AdminProjects';
import AllApplications from './AllApplications';
import AllUsers from './AllUsers';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Admin />} />
      <Route path="admin-projects" element={<AdminProjects />} />
      <Route path="admin-applications" element={<AllApplications />} />
      <Route path="all-users" element={<AllUsers />} />
    </Routes>
  );
}