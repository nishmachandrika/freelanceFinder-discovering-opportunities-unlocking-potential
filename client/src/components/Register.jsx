import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Register.css';

const Register = ({ setAuthType }) => {
  const { auth, setAuth, register } = useContext(GeneralContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, usertype } = auth;

    if (!username.trim() || !email.trim() || !password.trim() || !usertype) {
      alert('All fields are required.');
      return;
    }

    const result = await register(auth);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
  <div className="register-container">
    <form className="register-card" onSubmit={handleRegister}>
      <h2>Register</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="text"
          className="form-control"
          id="floatingUsername"
          placeholder="Username"
          value={auth.username}
          onChange={(e) => setAuth((prev) => ({ ...prev, username: e.target.value }))}
        />
        <label htmlFor="floatingUsername">Username</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder="Email"
          value={auth.email}
          onChange={(e) => setAuth((prev) => ({ ...prev, email: e.target.value }))}
        />
        <label htmlFor="floatingEmail">Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={auth.password}
          onChange={(e) => setAuth((prev) => ({ ...prev, password: e.target.value }))}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <select
        className="form-select form-select-lg mb-3"
        value={auth.usertype}
        onChange={(e) => setAuth((prev) => ({ ...prev, usertype: e.target.value }))}
      >
        <option value="">Select user type</option>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" className="btn btn-primary btn-block">
        Sign up
      </button>

      <p>
        Already registered? <span onClick={() => setAuthType('login')}>Login</span>
      </p>
    </form>
  </div>
);

};

export default Register;
