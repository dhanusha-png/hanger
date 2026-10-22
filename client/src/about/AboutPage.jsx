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

      {/* Section 1 (Even): Who We Are (Warm Cream #F5F0E5) */}
      <div className="home-tonal-even">
        <AboutWhoWeAre />
      </div>

      {/* Section 2 (Odd): What We Offer (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
        <AboutWhatWeOffer />
      </div>

      {/* Section 3 (Even): Approach / phases (Warm Cream #F5F0E5) */}
      <div className="home-tonal-even">
        <AboutApproach />
      </div>

      {/* Section 4 (Odd): On-Site Showcase (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
        <AboutShowcase />
      </div>

      {/* Section 5 (Even): Closing CTA (Warm Cream #F5F0E5) */}
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
