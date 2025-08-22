import React from 'react';
import ErrorMessage from './ErrorMessage';

const InputField = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const inputClasses = [
    'input-field',
    fullWidth ? 'input-full-width' : '',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && <ErrorMessage message={error} type="error" />}
    </div>
  );
};

export default InputField;
