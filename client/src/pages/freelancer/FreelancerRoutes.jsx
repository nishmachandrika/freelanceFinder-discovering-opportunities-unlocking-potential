import { Routes, Route } from 'react-router-dom';
import Freelancer from './Freelancer';
import AllProjects from './AllProjects';
import MyProjects from './MyProjects';
import MyApplications from './MyApplications';
import ProjectData from './ProjectData';

export default function FreelancerRoutes() {
  return (
    <Routes>
      <Route index element={<Freelancer />} />
      <Route path="all-projects" element={<AllProjects />} />
      <Route path="my-projects" element={<MyProjects />} />
      <Route path="my-applications" element={<MyApplications />} />
      <Route path="project/:id" element={<ProjectData />} />
    </Routes>
  );
}