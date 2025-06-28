import { Routes, Route } from 'react-router-dom';
import Client from './Client';
import ProjectApplications from './ProjectApplications';
import NewProject from './NewProject';
import ProjectWorking from './ProjectWorking';

export default function ClientRoutes() {
  return (
    <Routes>
      <Route index element={<Client />} />
      <Route path="project-applications" element={<ProjectApplications />} />
      <Route path="new-project" element={<NewProject />} />
      <Route path="client-project/:id" element={<ProjectWorking />} />
    </Routes>
  );
}