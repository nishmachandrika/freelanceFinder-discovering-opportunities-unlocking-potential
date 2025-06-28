import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/AllProjects.css';


const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      setProjects(response.data);
      setDisplayProjects(response.data.reverse());

      const skills = [];
      response.data.forEach((project) => {
        project.skills.forEach((skill) => {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
      });
      setAllSkills(skills);
    } catch (err) {
      console.log(err);
      fetchProjects(); // Retry on error
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter((size) => size !== value));
    }
  };

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        projects
          .filter((project) => categoryFilter.every((skill) => project.skills.includes(skill)))
          .reverse()
      );
    } else {
      setDisplayProjects(projects.reverse());
    }
  }, [categoryFilter]);

  return (
    <div className="all-projects-page">
      <h2>All projects</h2>
      <hr />
      <div className="project-filters">
        <h3>Filters</h3>
        <hr />
        <div className="filters">
          <h5>Skills:</h5>
          {allSkills.length > 0 ? (
            <div className="filter-options">
              {allSkills.map((skill) => (
                <div className="form-check" key={skill}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={skill}
                    id={`flexCheckDefault${skill}`}
                    onChange={handleCategoryCheckBox}
                  />
                  <label className="form-check-label" htmlFor={`flexCheckDefault${skill}`}>
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="projects-list">
        {displayProjects.map((project) => (
          <div className="listed-project" key={project._id} onClick={() => navigate(`/project/${project._id}`)}>
            <div className="listed-project-head">
              <h3>{project.title}</h3>
              <p>{String(project.postedDate).slice(0, 24)}</p>
            </div>
            <h5>Budget & ₹{project.budget}</h5>
            <p>{project.description}</p>
            <div className="skills">
              {project.skills.map((skill) => (
                <h6 key={skill}>{skill}</h6>
              ))}
            </div>
            <div className="bids-data">
              <p>{project.bids.length} bids</p>
              <h6>
                &₹
                {project.bids.length > 0
                  ? project.bidAmounts.reduce((accumulator, currentValue) => accumulator + currentValue)
                  : 0}
              </h6>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;