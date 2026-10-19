import React from 'react';
import './section-header.css';

/**
 * SectionHeader
 * Consistent luxury section header with eyebrow sparkle, serif title, gold highlight, and drawing underline.
 *
 * @param {string} eyebrow - Small uppercase tag (e.g. "PRODUCT SHOWCASE")
 * @param {string|React.ReactNode} title - Section title text
 * @param {string} goldHighlight - Specific text substring inside title to render in gold gradient
 * @param {string} description - Subtitle narrative text
 * @param {'left'|'center'|'right'} align - Text alignment
 * @param {boolean} showUnderline - Whether to render animated gold SVG underline
 * @param {React.ReactNode} action - Right-aligned action button/link
 */
export function SectionHeader({
  eyebrow,
  title,
  goldHighlight,
  description,
  align = 'center',
  showUnderline = true,
  action,
  className = '',
  style = {},
  ...props
}) {
  const renderFormattedTitle = () => {
    if (!goldHighlight || typeof title !== 'string') {
      return title;
    }

    const parts = title.split(new RegExp(`(${goldHighlight})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === goldHighlight.toLowerCase()) {
        return (
          <span key={index} className="hh-section-title-gold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const headerContent = (
    <div className={`hh-section-header align-${align} ${className}`} style={style} {...props}>
      {eyebrow && (
        <div className="hh-section-eyebrow">
          <span className="hh-eyebrow-sparkle">✦</span>
          <span>{eyebrow}</span>
        </div>
      )}

      <h2 className="hh-section-title">{renderFormattedTitle()}</h2>

      {showUnderline && (
        <svg
          className="hh-section-underline-svg"
          viewBox="0 0 140 8"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hh-underline-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fae29f" />
              <stop offset="50%" stopColor="#e8c070" />
              <stop offset="100%" stopColor="#c9a24b" />
            </linearGradient>
          </defs>
          <path
            className="hh-section-underline-path"
            d="M2 4 C 40 1, 90 7, 138 3"
          />
        </svg>
      )}

      {description && <p className="hh-section-desc">{description}</p>}
    </div>
  );

  if (action && align === 'left') {
    return (
      <div className="hh-section-header-top-row">
        {headerContent}
        <div className="hh-section-header-action">{action}</div>
      </div>
    );
  }

  return headerContent;
}
