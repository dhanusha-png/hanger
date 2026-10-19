import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './accordion.css';

/**
 * AccordionItem
 */
export function AccordionItem({
  title,
  children,
  isOpen,
  onToggle,
  id,
}) {
  return (
    <div className={`hh-accordion-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="hh-accordion-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-body-${id}`}
      >
        <span className="hh-accordion-title">{title}</span>
        <span className="hh-accordion-chevron" aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-body-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="hh-accordion-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Accordion
 * Groups AccordionItem components with single or multi-expand support.
 *
 * @param {Array<{ id: string, title: string, content: React.ReactNode }>} items
 * @param {boolean} allowMultiple - Whether multiple items can be opened simultaneously
 * @param {string} defaultOpenId - Item to open by default
 */
export function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpenId,
  className = '',
  style = {},
  ...props
}) {
  const [openIds, setOpenIds] = useState(() => (defaultOpenId ? [defaultOpenId] : []));

  const toggleItem = (id) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`hh-accordion-group ${className}`} style={style} {...props}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
