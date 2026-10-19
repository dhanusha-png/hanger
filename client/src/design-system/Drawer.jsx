import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './drawer.css';

/**
 * Drawer
 * Slide-out drawer panel from left or right with blurred backdrop.
 *
 * @param {boolean} isOpen - Visibility state
 * @param {() => void} onClose - Close handler
 * @param {'left'|'right'} side - Slide-in direction
 * @param {string} title - Header title text
 * @param {React.ReactNode} children - Drawer body contents
 * @param {React.ReactNode} footer - Optional bottom actions
 * @param {number|string} width - Drawer width (default 420px)
 */
export function Drawer({
  isOpen,
  onClose,
  side = 'right',
  title,
  children,
  footer,
  width = 420,
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const slideOffset = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="hh-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className={`hh-drawer-container side-${side} ${className}`}
            style={{
              '--hh-drawer-width': typeof width === 'number' ? `${width}px` : width,
            }}
            initial={{ x: slideOffset }}
            animate={{ x: 0 }}
            exit={{ x: slideOffset }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
          >
            {title && (
              <div className="hh-drawer-header">
                <h3 className="hh-drawer-title">{title}</h3>
                <button
                  type="button"
                  className="hh-drawer-close-btn"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="hh-drawer-body">{children}</div>

            {footer && <div className="hh-drawer-footer">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
