import React, { useState, useEffect } from 'react';
import { InstallationsHero } from './InstallationsHero';
import { InstallationSolutions } from './InstallationSolutions';
import { InstallationProjects } from './InstallationProjects';
import { InstallationVideoAction } from './InstallationVideoAction';
import { InstallationFAQ } from './InstallationFAQ';
import { InstallationCTA } from './InstallationCTA';
import { FloatingWidgets } from '../home/FloatingWidgets';
import './installations-hero.css';
import './installations.css';

export function InstallationsPage({ cart = [], total = 0, remove, updateQty, chat, setChat }) {
  const [selectedType, setSelectedType] = useState('installation');

  useEffect(() => {
    document.title = 'Installation & Service | HangerHome';
    // If hash exists in URL, scroll to it smoothly
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, []);

  return (
    <div className="install-page">
      {/* 1. Cinematic Hero with New Dual-Technician Scene */}
      <InstallationsHero onSelectType={setSelectedType} />

      {/* 2. Page Sections: Sticky Tabs, Installation Categories, Service Solutions, How It Works Strip */}
      <InstallationSolutions onSelectType={setSelectedType} />

      {/* 3. Real Installations Projects Showcase with Lightbox */}
      <InstallationProjects />

      {/* 4. Demonstration Video & Design Pillars */}
      <InstallationVideoAction />

      {/* 5. Comprehensive FAQs */}
      <InstallationFAQ />

      {/* 6. Closing CTA Band with Segmented Toggle & Quick Booking Form */}
      <InstallationCTA initialType={selectedType} />

      {/* Floating Action Buttons */}
      <FloatingWidgets
        cart={cart}
        total={total}
        onRemove={remove}
        onUpdateQty={updateQty}
        chat={chat}
        setChat={setChat}
      />
    </div>
  );
}
