import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-applications').then(
        (response) => {
          setApplications(response.data.filter((application) => application.clientId === localStorage.getItem('userId')));
          setDisplayApplications(response.data.filter((application) => application.clientId === localStorage.getItem('userId')).reverse());
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (applications.length > 0) {
      applications.map((application) => {
        if (!projectTitles.includes(application.title)) setProjectTitles([...projectTitles]);
      });
    }
  }, [applications]);

  useEffect(() => {
    if (projectTitles.length > 0) {
      projectTitles.filter((title) => !projectTitles.includes(title));
    }
  }, [projectTitles]);

  const handleApprove = async (id) => {
    try {
      await axios.get(`http://localhost:6001/approve-application/${id}`).then(
        (response) => {
          alert("Application approved");
          fetchApplications();
        }
      );
    } catch (err) {
      alert("operation failed!!!");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`http://localhost:6001/reject-application/${id}`).then(
        (response) => {
          alert("Application rejected!!!");
          fetchApplications();
        }
      );
    } catch (err) {
      alert("operation failed!!!");
    }
  };

  const [projectFilter, setProjectFilter] = useState('');

  const handleFilterChange = (value) => {
    if (value === "") {
      setDisplayApplications(applications.reverse());
    } else {
      setDisplayApplications(applications.filter((application) => application.title === value).reverse());
    }
  };

  return (
    <div className="client-applications-page">
      {projectTitles ? (
        <span>
          <h3>Applications</h3>
          <select className="form-control" onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="">All Projects</option>
            {projectTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </span>
      ) : null}
      <div className="client-applications-body">
        {displayApplications.map((application) => (
          <ApplicationDisplay
            key={application._id}
            application={application}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectApplications;