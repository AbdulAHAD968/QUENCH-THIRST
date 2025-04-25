import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EmployeeSettings.css';

const EmployeeSettings = ({ userId }) => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [activeTab, setActiveTab] = useState('account');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/users/profile/${userId}`);
        setUserInfo(prev => ({
          ...prev,
          username: data.username,
          email: data.email
        }));
        toast.success('Profile updated successfully!', {
          icon: <FaCheck style={{ color: '#28a745' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
      } 
      catch (error) {
        toast.error('Failed to update profile', {
          icon: <FaTimes style={{ color: '#dc3545' }} />,
          autoClose: 4000,
          position: 'top-right',
        });
        console.error('Error fetching user data:', error);
      } 
      finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    } 
    else {
      toast.error('Failed to update profile', {
        icon: <FaTimes style={{ color: '#dc3545' }} />,
        autoClose: 4000,
        position: 'top-right',
      });
    }
  }, [userId]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    const newErrors = {};
    if (userInfo.newPassword && userInfo.newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      toast.warning('Passwords do not match', {
        icon: <FaTimes style={{ color: '#ffc107' }} />,
        autoClose: 3000,
        position: 'top-right',
      });
    }
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      toast.warning('Passwords do not match', {
        icon: <FaTimes style={{ color: '#ffc107' }} />,
        autoClose: 3000,
        position: 'top-right',
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === 'security' && !validatePassword()) {
        setIsLoading(false);
        return;
      }

      const updateData = {
        username: userInfo.username,
        email: userInfo.email,
      };

      if (activeTab === 'security') {
        if (!userInfo.currentPassword) {
          toast.error('Current password is required', {
            icon: <FaTimes className="toast-error-icon" />
          });
          setIsLoading(false);
          return;
        }
        updateData.currentPassword = userInfo.currentPassword;
        updateData.newPassword = userInfo.newPassword;
      }

      const { data } = await axios.put(
        `/api/users/profile/${userId}`,
        updateData
      );
      
      setUserInfo(prev => ({
        ...prev,
        username: data.username,
        email: data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      toast.success('Profile updated successfully!', {
        icon: <FaCheck className="toast-success-icon" />
      });
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Failed to update profile';
      
      toast.error(message, {
        icon: <FaTimes className="toast-error-icon" />
      });
      
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      
      <div className="settings-tabs">
        <button 
          className={activeTab === 'account' ? 'active' : ''}
          onClick={() => setActiveTab('account')}
        >
          <FaUser /> Account
        </button>
        <button 
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          <FaLock /> Security
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="settings-form">
        {activeTab === 'account' && (
          <div className="settings-section">
            <h2><FaUser /> Account Information</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={userInfo.username}
                onChange={handleUserInfoChange}
                placeholder="Enter new username"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                placeholder="Enter new email"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="settings-section">
            <h2><FaLock /> Security Settings</h2>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={userInfo.currentPassword}
                onChange={handleUserInfoChange}
                placeholder="Enter current password"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={userInfo.newPassword}
                onChange={handleUserInfoChange}
                placeholder="Enter new password"
                disabled={isLoading}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={userInfo.confirmPassword}
                onChange={handleUserInfoChange}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          </div>
        )}
        
        <button type="submit" className="save-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' Saving...'}
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
};

export default EmployeeSettings;