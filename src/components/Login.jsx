import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiAlertCircle } from 'react-icons/fi';
import { signInUser } from '../api/firestoreService';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await signInUser(formData.email, formData.password);
      if (user) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <FiUser className="logo-icon" />
            <h1>Task Management</h1>
          </div>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <FiAlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Credentials</h3>
          <div className="credential-cards">
            <div className="credential-card admin">
              <h4>Admin</h4>
              <p><strong>Email:</strong> admin@taskmgmt.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <div className="credential-card manager">
              <h4>Manager</h4>
              <p><strong>Email:</strong> manager@taskmgmt.com</p>
              <p><strong>Password:</strong> manager123</p>
            </div>
            <div className="credential-card employee">
              <h4>Employee</h4>
              <p><strong>Email:</strong> employee@taskmgmt.com</p>
              <p><strong>Password:</strong> employee123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 