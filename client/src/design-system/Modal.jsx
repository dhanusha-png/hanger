import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './modal.css';

/**
 * Modal
 * Accessible dark luxury modal dialogue with keyboard trap and blurred backdrop.
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {() => void} onClose - Close handler
 * @param {string} title - Header title text
 * @param {React.ReactNode} children - Modal body contents
 * @param {React.ReactNode} footer - Optional footer action buttons
 * @param {number|string} maxWidth - Modal width cap (default 640px)
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 640,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="hh-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={`hh-modal-container ${className}`}
            style={{
              '--hh-modal-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            }}
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="hh-modal-header">
                <h3 className="hh-modal-title">{title}</h3>
                <button
                  type="button"
                  className="hh-modal-close-btn"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="hh-modal-body">{children}</div>

            {footer && <div className="hh-modal-footer">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
