import React from 'react';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: '',
    large: 'spinner-large'
  };

  const classes = [
    'loading-container',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
