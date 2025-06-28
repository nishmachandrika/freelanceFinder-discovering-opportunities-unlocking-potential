import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/freelancer.css'; // Fixed import path

const Freelancer = () => {
  const [isDataupdateOpen, setIsDataupdateOpen] = useState(false);
  const navigate = useNavigate();
  const [freelancerData, setFreelancerData] = useState({});
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [applicationsCount, setApplicationsCount] = useState([]);  // Added missing state

  useEffect(() => {
    fetchApplications();
    fetchFreelancerData();
  }, [freelancerId]);  // Added dependencies

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-applications');
      setApplicationsCount(
        response.data.filter(application => 
          application.freelancerId === localStorage.getItem('userId')
        )
      );
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const fetchFreelancerData = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-freelancer');  // Fixed endpoint
      const data = response.data.find(
        item => item.freelancerId === localStorage.getItem('userId')
      );
      
      if (data) {
        setFreelancerData(data);
        setSkills(data.skills || []);
        setDescription(data.description || '');
        setFreelancerId(data.freelancerId || '');
      }
    } catch (err) {
      console.error('Error fetching freelancer data:', err);
    }
  };

  const updateUserData = async () => {
    try {
      const updatedData = {
        freelancerId,
        skills: updateSkills.split(',').map(skill => skill.trim()),
        description: updateDescription,
      };
      await axios.put(
        `http://localhost:6001/update-freelancer/${freelancerId}`,
        updatedData
      );
      setIsDataupdateOpen(false);
      fetchFreelancerData();
    } catch (err) {
      console.error('Error updating freelancer data:', err);
    }
  };

 

  return (
    <div className="freelancer-details">
      {isDataupdateOpen ? (
        <div className="freelancer-details-update">
          <span>
            <label htmlFor="myskills"><h4>My skills</h4></label>
            <input
              type="text"
              className="form-control"
              id="myskills"
              placeholder="Enter skills"
              value={updateSkills}
              onChange={(e) => setUpdateSkills(e.target.value)}
            />
          </span>
          <span>
            <label htmlFor="description-textarea"><h4>Description</h4></label>
            <textarea
              className="form-control"
              id="description-textarea"
              placeholder="Enter your description"
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
            />
          </span>
          <button className="btn btn-outline-success mt-3" onClick={updateUserData}>Update</button>
        </div>
      ) : (
        <div className="freelancer-details-data">
          <span>
            <h4>My skills</h4>
            <div className="skills">
              {skills.map((skill) => (
                <h5 className="skill" key={skill}>{skill}</h5>
              ))}
              {skills.length === 0 && <p>No skills available</p>}
            </div>
          </span>
          <span>
            <h4>Description</h4>
            <p>{description}</p>
            {description === '' && <p>please add your description</p>}
          </span>
          <button className="btn btn-outline-success" onClick={() => setIsDataupdateOpen(true)}>Update</button>
        </div>
      )}
      <div className="freelancer-home">
        <div className="home-cards">
          <div className="home-card">
            <h4>Current projects</h4>
            <p>{freelancerData.currentProjects?.length || 0}</p>
            <button onClick={() => navigate('/my-projects')}>View projects</button>
          </div>
          <div className="home-card">
            <h4>Completed projects</h4>
            <p>{freelancerData.completedProjects?.length || 0}</p>
            <button onClick={() => navigate('/my-projects')}>View projects</button>
          </div>
          <div className="home-card">
            <h4>Applications</h4>
            <p>{applicationsCount?.length || 0}</p>
            <button onClick={() => navigate('/myApplications')}>View Applications</button>
          </div>
          <div className="home-card">
            <h4>Funds</h4>
            <p>Available: &₹{freelancerData.funds || 0}</p>
            {/* <button>withdraw</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freelancer;