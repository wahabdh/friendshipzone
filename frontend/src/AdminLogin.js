import React, { useState } from 'react';

function AdminLogin({ setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials
    const adminUsername = 'admin';
    const adminPassword = '123456';

    if (username === adminUsername && password === adminPassword) {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Invalid username or password');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="form-input"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-login">
            Login
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <p>Username: admin</p>
          <p>Password: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
