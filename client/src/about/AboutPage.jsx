import React from 'react';
import { AboutHero } from './AboutHero';
import { AboutWhoWeAre } from './AboutWhoWeAre';
import { AboutWhatWeOffer } from './AboutWhatWeOffer';
import { AboutApproach } from './AboutApproach';
import { AboutShowcase } from './AboutShowcase';
import { AboutCTA } from './AboutCTA';
import { FloatingWidgets } from '../home/FloatingWidgets';
import './about.css';

export function AboutPage({ cart = [], total = 0, remove, updateQty, chat, setChat }) {
  return (
    <div className="about-page">
      {/* Section 1: Hero (unchanged) */}
      <AboutHero />

      {/* Section 2 (Even): Who We Are (Deep Forest #0B211A) */}
      <div className="home-tonal-even">
        <AboutWhoWeAre />
      </div>

      {/* Section 3 (Odd): What We Offer (Dark #04120e) */}
      <div className="home-tonal-odd">
        <AboutWhatWeOffer />
      </div>

      {/* Section 4 (Even): Approach / phases (Deep Forest #0B211A) */}
      <div className="home-tonal-even">
        <AboutApproach />
      </div>

      {/* Section 5 (Odd): On-Site Showcase (Dark #04120e) */}
      <div className="home-tonal-odd">
        <AboutShowcase />
      </div>

      {/* Section 6 (Even): Closing CTA (Deep Forest #0B211A) */}
      <div className="home-tonal-even about-cta-tonal-wrap">
        <AboutCTA />
      </div>

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
