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
      {/* 1. Cinematic Hero with New Dual-Technician Scene (unchanged) */}
      <InstallationsHero onSelectType={setSelectedType} />

      {/* Section 2 (Even): Solutions with tabs (Deep Forest #0B211A) */}
      <div className="home-tonal-even">
        <InstallationSolutions onSelectType={setSelectedType} />
      </div>

      {/* Section 3 (Odd): Real Installations Projects Showcase (Dark #04120e) */}
      <div className="home-tonal-odd">
        <InstallationProjects />
      </div>

      {/* Section 4 (Even): Demonstration Video & Design Pillars (Deep Forest #0B211A) */}
      <div className="home-tonal-even">
        <InstallationVideoAction />
      </div>

      {/* Section 5 (Odd): Comprehensive FAQs (Dark #04120e) */}
      <div className="home-tonal-odd">
        <InstallationFAQ />
      </div>

      {/* Section 6 (Even): Closing CTA Band with Segmented Toggle & Quick Booking Form (Deep Forest #0B211A) */}
      <div className="home-tonal-even">
        <InstallationCTA initialType={selectedType} />
      </div>

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
