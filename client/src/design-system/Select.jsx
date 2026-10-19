import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './form-inputs.css';

/**
 * Select
 * Dark luxury select dropdown with floating label and custom chevron icon.
 */
export function Select({
  id,
  label,
  value,
  defaultValue,
  onChange,
  options = [],
  children,
  error,
  helperText,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const hasValue = value !== undefined ? Boolean(value) : Boolean(defaultValue);
  const isFloating = focused || hasValue;

  return (
    <div className={`hh-form-group ${className}`}>
      <div
        className={`hh-input-wrapper ${focused ? 'is-focused' : ''} ${
          isFloating ? 'is-floating' : ''
        } ${error ? 'has-error' : ''}`}
      >
        <select
          id={selectId}
          value={value}
          defaultValue={defaultValue}
          className="hh-select-field"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {label && (
          <label htmlFor={selectId} className="hh-floating-label">
            {label}
          </label>
        )}

        <span
          className="hh-input-icon-right"
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </span>
      </div>

      {error ? (
        <span className="hh-form-error-text">{error}</span>
      ) : helperText ? (
        <span className="hh-form-helper-text">{helperText}</span>
      ) : null}
    </div>
  );
}
