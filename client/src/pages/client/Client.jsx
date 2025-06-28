import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/client/newProject.css';  // Fixed import path

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Added loading state
  const [error, setError] = useState(null);  // Added error state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:6001/fetch-projects');
        const clientProjects = response.data.filter(
          pro => pro.clientId === localStorage.getItem('userId')
        );
        setProjects(clientProjects);
        setDisplayProjects([...clientProjects].reverse());
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (status) => {
    let filtered = [...projects];
    
    switch (status) {
      case "Un Assigned":
        filtered = filtered.filter(project => project.status === "Available");
        break;
      case "In Progress":
        filtered = filtered.filter(project => project.status === "Assigned");
        break;
      case "completed":
        filtered = filtered.filter(project => project.status === "Completed");
        break;
      default:
        // Show all projects
        break;
    }
    
    setDisplayProjects(filtered.reverse());
  };

  if (isLoading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="client-projects-page">
      <div className="client-projects-list">
        <div className="client-projects-header">
          <h3>My Projects</h3>
          <select 
            className="form-control" 
            onChange={(e) => handleFilterChange(e.target.value)}
            defaultValue=""
          >
            <option value="">All Projects</option>
            <option value="Un Assigned">Unassigned</option>
            <option value="In Progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {displayProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found</p>
          </div>
        ) : (
          displayProjects.map((project) => (
            <div 
              className="listed-project" 
              key={project._id} 
              onClick={() => navigate(`/client-project/${project._id}`)}
            >
              <div className="listed-project-head">
                <h3>{project.title}</h3>
                <p>{new Date(project.postedDate).toLocaleDateString()}</p>
                <div>
                  <h5>Budget - ₹{project.budget}</h5>
                  <p className="project-description">
                    {project.description.length > 100 
                      ? `${project.description.substring(0, 100)}...` 
                      : project.description}
                  </p>
                </div>
              </div>
              <div className="bids-data">
                {project.applications?.length > 0 && (
                  <p>Applications: {project.applications.length}</p>
                )}
                <h6 className={`status-${project.status.toLowerCase()}`}>
                  Status: {project.status}
                </h6>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Client;