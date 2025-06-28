import React, { useContext } from 'react';
import '../styles/Login.css';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Sign in
        </button>
        <p className="register-text">
          Not registered? <span onClick={() => setAuthType('register')}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
