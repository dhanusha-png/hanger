import React, { useState } from 'react';
import './form-inputs.css';

/**
 * Input
 * Dark luxury text input with floating label, gold focus ring, icons, and error handling.
 */
export function Input({
  id,
  label,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  iconLeft,
  iconRight,
  error,
  helperText,
  className = '',
  type = 'text',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const hasValue = value !== undefined ? Boolean(value) : Boolean(defaultValue);
  const isFloating = focused || hasValue;

  return (
    <div className={`hh-form-group ${className}`}>
      <div
        className={`hh-input-wrapper ${focused ? 'is-focused' : ''} ${
          isFloating ? 'is-floating' : ''
        } ${error ? 'has-error' : ''} ${iconLeft ? 'has-icon-left' : ''}`}
      >
        {iconLeft && <span className="hh-input-icon-left">{iconLeft}</span>}

        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          className="hh-input-field"
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          onChange={onChange}
          {...props}
        />

        {label && (
          <label htmlFor={inputId} className="hh-floating-label">
            {label}
          </label>
        )}

        {iconRight && <span className="hh-input-icon-right">{iconRight}</span>}
      </div>

      {error ? (
        <span className="hh-form-error-text">{error}</span>
      ) : helperText ? (
        <span className="hh-form-helper-text">{helperText}</span>
      ) : null}
    </div>
  );
}
