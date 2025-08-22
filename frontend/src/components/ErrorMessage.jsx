import React from 'react';

const ErrorMessage = ({ 
  message, 
  type = 'error',
  className = '',
  showIcon = true 
}) => {
  if (!message) return null;

  const typeClasses = {
    error: 'error-message',
    warning: 'warning-message',
    info: 'info-message'
  };

  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const classes = [
    typeClasses[type],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {showIcon && <span className="error-icon">{icons[type]}</span>}
      <span className="error-text">{message}</span>
    </div>
  );
};

export default ErrorMessage;
