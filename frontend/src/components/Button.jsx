import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '',
  fullWidth = false,
  as: Component = 'button',
  ...props 
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: '',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    outline: 'btn-outline'
  };
  
  const sizeClasses = {
    small: 'btn-small',
    medium: '',
    large: 'btn-large'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'btn-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  // If rendering as a link or other component, don't pass button-specific props
  if (Component !== 'button') {
    const { type: buttonType, ...linkProps } = props;
    return (
      <Component
        className={classes}
        onClick={onClick}
        {...linkProps}
      >
        {children}
      </Component>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
