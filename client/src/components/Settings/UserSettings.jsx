import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaBell, FaPalette, FaLanguage } from 'react-icons/fa';
import './UserSettings.css';

const UserSettings = () => {
  // User information state
  const [userInfo, setUserInfo] = useState({
    username: 'john_doe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Delivery location state
  const [deliveryLocation, setDeliveryLocation] = useState({
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'english',
    notifications: true,
    newsletter: true
  });

  // Form states
  const [activeTab, setActiveTab] = useState('account');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setDeliveryLocation(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePassword = () => {
    const newErrors = {};
    if (userInfo.newPassword && userInfo.newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (activeTab === 'security' && !validatePassword()) {
      return;
    }

    // Here you would typically make an API call to update the settings
    console.log('Updating settings:', { userInfo, deliveryLocation, preferences });
    
    setSuccessMessage('Settings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      
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
        <button 
          className={activeTab === 'location' ? 'active' : ''}
          onClick={() => setActiveTab('location')}
        >
          <FaMapMarkerAlt /> Delivery Location
        </button>
        <button 
          className={activeTab === 'preferences' ? 'active' : ''}
          onClick={() => setActiveTab('preferences')}
        >
          <FaPalette /> Preferences
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
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          </div>
        )}
        
        {activeTab === 'location' && (
          <div className="settings-section">
            <h2><FaMapMarkerAlt /> Delivery Location</h2>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={deliveryLocation.address}
                onChange={handleLocationChange}
                placeholder="Street address"
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={deliveryLocation.city}
                onChange={handleLocationChange}
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <label>State/Province</label>
              <input
                type="text"
                name="state"
                value={deliveryLocation.state}
                onChange={handleLocationChange}
                placeholder="State or province"
              />
            </div>
            <div className="form-group">
              <label>ZIP/Postal Code</label>
              <input
                type="text"
                name="zipCode"
                value={deliveryLocation.zipCode}
                onChange={handleLocationChange}
                placeholder="Postal code"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={deliveryLocation.country}
                onChange={handleLocationChange}
                placeholder="Country"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="settings-section">
            <h2><FaPalette /> Preferences</h2>
            <div className="form-group">
              <label>Theme</label>
              <select
                name="theme"
                value={preferences.theme}
                onChange={handlePreferenceChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select
                name="language"
                value={preferences.language}
                onChange={handlePreferenceChange}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={preferences.notifications}
                  onChange={handlePreferenceChange}
                />
                Enable Notifications
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={preferences.newsletter}
                  onChange={handlePreferenceChange}
                />
                Subscribe to Newsletter
              </label>
            </div>
          </div>
        )}
        
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserSettings;