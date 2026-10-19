import React from 'react';

/**
 * GoldDivider
 * Architectural thin gold line with center diamond or star sparkle.
 *
 * @param {'star'|'diamond'|'plain'} variant - Center emblem
 * @param {boolean} glow - Whether to emit soft gold glow
 */
export function GoldDivider({
  variant = 'star',
  glow = false,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={`hh-gold-divider ${glow ? 'glow' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: 'clamp(24px, 3.5vw, 42px) 0',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(232, 192, 112, 0.45) 50%, rgba(232, 192, 112, 0.65))',
        }}
      />
      {variant !== 'plain' && (
        <span
          style={{
            padding: '0 14px',
            color: '#e8c070',
            fontSize: variant === 'star' ? '12px' : '10px',
            filter: glow ? 'drop-shadow(0 0 8px rgba(232, 192, 112, 0.6))' : 'none',
            userSelect: 'none',
          }}
        >
          {variant === 'star' ? '✦' : '◆'}
        </span>
      )}
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(232, 192, 112, 0.65), rgba(232, 192, 112, 0.45) 50%, transparent)',
        }}
      />
    </div>
  );
}
