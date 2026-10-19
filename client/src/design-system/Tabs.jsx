import React from 'react';
import { motion } from 'framer-motion';
import './tabs.css';

/**
 * Tabs
 * Pill tab bar with animated sliding gold indicator.
 *
 * @param {Array<{ id: string, label: string, icon?: React.ReactNode, count?: number }>} tabs
 * @param {string} activeTab - Selected tab id
 * @param {(id: string) => void} onChange - Tab change handler
 */
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  layoutId = 'hh-active-tab-indicator',
  style = {},
  ...props
}) {
  return (
    <div className={`hh-tabs-container ${className}`} style={style} role="tablist" {...props}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`hh-tab-button ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange && onChange(tab.id)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(232, 192, 112, 0.2)',
                  color: isActive ? '#04120e' : '#e8c070',
                  marginLeft: '4px',
                }}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                className="hh-tab-active-pill"
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
