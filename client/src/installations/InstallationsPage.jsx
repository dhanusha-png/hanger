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

      {/* Section 1 (Odd): Solutions with tabs (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
        <InstallationSolutions onSelectType={setSelectedType} />
      </div>

      {/* Section 2 (Even): Real Installations Projects Showcase (Warm Cream #F5F0E5) */}
      <div className="home-tonal-even">
        <InstallationProjects />
      </div>

      {/* Section 3 (Odd): Demonstration Video & Design Pillars (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
        <InstallationVideoAction />
      </div>

      {/* Section 4 (Even): Common Questions with 4-Item Scrollable Box (Warm Cream #F5F0E5) */}
      <div className="home-tonal-even">
        <InstallationFAQ />
      </div>

      {/* Section 5 (Odd): Closing CTA Band with Segmented Toggle & Quick Booking Form (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
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
