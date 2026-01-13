import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestDropdown = () => {
  const navigate = useNavigate();

  const testNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Avatar Dropdown Functions</h2>
      <button onClick={() => testNavigation('/settings')}>Test Settings</button>
      <button onClick={() => testNavigation('/help')}>Test Help</button>
      <button onClick={() => testNavigation('/about')}>Test About</button>
    </div>
  );
};

export default TestDropdown;