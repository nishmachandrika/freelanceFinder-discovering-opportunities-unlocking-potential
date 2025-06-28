import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { GeneralContext, GeneralContextProvider } from '../../context/GeneralContext';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();

  console.log(params['id']);

  const [project, setProject] = useState();
  const [chats, setChats] = useState();

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
    fetchChats();
  }, []);

  const fetchProject = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data.id);
      setClientId(response.data.clientId);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChats = async () => {
    await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`).then(
      (response) => {
        setChats(response.data);
      }
    );
  };

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: params['id'], freelancerId: localStorage.getItem("userId") });
  };

  useEffect(() => {
    socket.on("message-from-user", () => {
      fetchChats();
    });
  }, [socket]);

  const [clientId, setClientId] = useState("");
  const [freelancerId, setfreelancerId] = useState(localStorage.getItem("userId"));
  const [projectId] = useState(params['id']);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleBidding = async () => {
    await axios.post("http://localhost:6001/make-bid", { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime }).then(
      () => {
        setProposal("");
        setBidAmount(0);
        setEstimatedTime("");
        alert("Bidding successful!!!");
      }
    ).catch((err) => {
      alert("Bidding failed!! Try again!!");
    });
  };

  const handleProjectSubmission = async () => {
    await axios.post("http://localhost:6001/submit-project", { clientId, freelancerId, projectId, projectLink, manualLink, submissionDescription }).then(
      () => {
        setProjectLink("");
        setManualLink("");
        setSubmissionDescription("");
        alert("submission successful!!!");
      }
    ).catch((err) => {
      alert("submission failed!! Try again!!");
    });
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", { projectId: params['id'], senderId: localStorage.getItem("userId"), message, time: new Date() });
    fetchChats();
    setMessage("");
  };

  return (
    <div>
      {project ? (
        <div className="project-data-page">
          <div className="project-data-container">
            <div className="project-data">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span>
                <h5>Required skills</h5>
                <div className="required-skills">
                  {project.skills.map((skill) => (
                    <p key={skill}>{skill}</p>
                  ))}
                </div>
              </span>
              <span>
                <h5>Budget</h5>
                <h6>&8377; {project.budget}</h6>
              </span>
              <span>
                <h6>Status - {project.status}</h6>
              </span>
            </div>
            <div className="bids-data">
              {project.applications.length > 0 ? <p>Applications - {project.applications.length}</p> : ""}
            </div>
          </div>
          <div className="project-form-body">
            <h4>Send proposal</h4>
            <span>
              <div className="form-floating">
                <input type="number" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                <label htmlFor="floatingPassword">Budget</label>
              </div>
              <div className="form-floating">
                <input type="number" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
                <label htmlFor="floatingPassword">Estimated time (days)</label>
              </div>
              <div className="form-floating">
                <textarea className="form-control mb-3" id="floatingPassword" placeholder="Password" value={proposal} onChange={(e) => setProposal(e.target.value)} />
                <label htmlFor="floatingPassword">Describe your proposal</label>
              </div>
              {project.bids.includes(localStorage.getItem("userId")) ? (
                <button className="btn btn-success" onClick={handleBidding}>Post Bid</button>
              ) : (
                <button className="btn btn-primary" disabled>Already bidded</button>
              )}
            </span>
            {project.freelancerId === localStorage.getItem("userId") ? (
              <div>
                {project.submissionAccepted ? (
                  <p>Project completed</p>
                ) : (
                  ""
                )}
                <div className="form-floating">
                  <input type="text" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
                  <label htmlFor="floatingPassword">Project link</label>
                </div>
                <div className="form-floating">
                  <input type="text" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={manualLink} onChange={(e) => setManualLink(e.target.value)} />
                  <label htmlFor="floatingPassword">Manual link</label>
                </div>
                <div className="form-floating">
                  <textarea className="form-control mb-3" id="floatingPassword" placeholder="Password" value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} />
                  <label htmlFor="floatingPassword">Describe your work</label>
                </div>
                {project.submission ? (
                  <button className="btn btn-secondary" disabled>Already submitted</button>
                ) : (
                  <button className="btn btn-success" onClick={handleProjectSubmission}>Submit project</button>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="project-chat-container">
            <h4>Chat with the client</h4>
            <hr />
            {project.freelancerId === localStorage.getItem("userId") ? (
              <div className="chat-body">
                {chats ? (
                  chats
                ) : (
                  ""
                )}
                <div className="chat-messages">
                  {/* Chat messages rendering can be added here */}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div className="listed-project-head">
          <h3>Loading...</h3>
        </div>
      )}
    </div>
  );
};

export default ProjectData;