import React, { useState } from 'react';
import './form-inputs.css';

/**
 * Textarea
 * Dark luxury textarea with floating label and gold focus ring.
 */
export function Textarea({
  id,
  label,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  error,
  helperText,
  className = '',
  rows = 4,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const hasValue = value !== undefined ? Boolean(value) : Boolean(defaultValue);
  const isFloating = focused || hasValue;

  return (
    <div className={`hh-form-group ${className}`}>
      <div
        className={`hh-input-wrapper ${focused ? 'is-focused' : ''} ${
          isFloating ? 'is-floating' : ''
        } ${error ? 'has-error' : ''}`}
      >
        <textarea
          id={textareaId}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          className="hh-textarea-field"
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
          <label
            htmlFor={textareaId}
            className="hh-floating-label"
            style={{ top: '24px' }}
          >
            {label}
          </label>
        )}
      </div>

      {error ? (
        <span className="hh-form-error-text">{error}</span>
      ) : helperText ? (
        <span className="hh-form-helper-text">{helperText}</span>
      ) : null}
    </div>
  );
}
