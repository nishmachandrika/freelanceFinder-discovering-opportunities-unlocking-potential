import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/MyProjects.css';


const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await axios
      .get('http://localhost:6001/fetch-projects')
      .then((response) => {
        const pros = response.data.filter(
          (pro) => pro.freelancerId === localStorage.getItem('userId')
        );
        setProjects(pros);
        setDisplayProjects(pros.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilterChange = (data) => {
    if (data === '') {
      setDisplayProjects([...projects].reverse());
    } else if (data === 'In Progress') {
      setDisplayProjects(
        projects.filter((project) => project.status === 'Assigned').reverse()
      );
    } else if (data === 'Completed') {
      setDisplayProjects(
        projects.filter((project) => project.status === 'Completed').reverse()
      );
    }
  };

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects</h3>
          <select
            className="form-control"
            placeholder="Project status"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">Choose project status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <hr />

        {displayProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          displayProjects.map((project) => (
            <div className="project-card" key={project._id}>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <p>
                <b>Status:</b> {project.status}
              </p>
              <p>
                <b>Budget:</b> ₹{project.budget}
              </p>
              {/* Add buttons if needed */}
              {/* <button onClick={() => navigate(`/project/${project._id}`)}>View Details</button> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProjects;
