import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    completedProjects: 0,
    applications: 0,
    users: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Use Promise.all for parallel requests
        const [projectsRes, applicationsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:6001/fetch-projects'),
          axios.get('http://localhost:6001/fetch-applications'),
          axios.get('http://localhost:6001/fetch-users')
        ]);

        const completedProjects = projectsRes.data.filter(
          pro => pro.status === "Completed"
        ).length;

        setStats({
          projects: projectsRes.data.length,
          completedProjects,
          applications: applicationsRes.data.length,
          users: usersRes.data.length,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Admin dashboard error:', err);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load dashboard data'
        }));
      }
    };

    fetchData();
  }, []);

  if (stats.isLoading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  if (stats.error) {
    return <div className="error-message">{stats.error}</div>;
  }

  const cardData = [
    {
      title: 'All Projects',
      value: stats.projects,
      action: () => navigate('/admin-projects'),
      buttonText: 'View Projects'
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
      action: () => navigate('/admin-projects?status=completed'),
      buttonText: 'View Projects'
    },
    {
      title: 'Applications',
      value: stats.applications,
      action: () => navigate('/admin-applications'),
      buttonText: 'View Applications'
    },
    {
      title: 'Users',
      value: stats.users,
      action: () => navigate('/all-users'),
      buttonText: 'View Users'
    }
  ];

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Dashboard</h2>
      <div className="stats-grid">
        {cardData.map((card, index) => (
          <div key={index} className="stat-card">
            <h3>{card.title}</h3>
            <p className="stat-value">{card.value}</p>
            <button 
              className="stat-button"
              onClick={card.action}
            >
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;