import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertCircle, X } from 'lucide-react';
import './toast.css';

/**
 * Toast
 * Floating dark glass toast message with auto-dismiss.
 *
 * @param {boolean} isOpen - Toast visibility
 * @param {() => void} onClose - Close handler
 * @param {string} message - Text notification
 * @param {'success'|'info'|'warning'|'error'} variant - Status type
 * @param {number} duration - Auto dismiss in ms (default 3500)
 */
export function Toast({
  isOpen,
  onClose,
  message,
  variant = 'success',
  duration = 3500,
  icon,
}) {
  useEffect(() => {
    if (!isOpen || !duration) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  const defaultIcon = () => {
    if (variant === 'success') return <Check size={14} strokeWidth={2.5} />;
    if (variant === 'warning' || variant === 'error') return <AlertCircle size={14} />;
    return <Info size={14} />;
  };

  return (
    <div className="hh-toast-container" aria-live="polite">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="hh-toast-card"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hh-toast-icon">{icon || defaultIcon()}</span>
            <span>{message}</span>
            <button
              type="button"
              className="hh-toast-close"
              onClick={onClose}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
