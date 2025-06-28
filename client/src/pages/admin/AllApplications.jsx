import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/allApplications.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      await axios.get('http://localhost:6001/fetch-projects').then(
        (response) => {
          setProjects(response.data);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-projects-page">
      <div className="admin-projects-container">
        <h3>Projects</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table className="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Skills</th>
              <th>Budget</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>
                  {project.skills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
                </td>
                <td>₹{project.budget}</td>
                <td>{project.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;