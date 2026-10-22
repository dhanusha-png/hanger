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

      {/* Section 1 (Odd): Who We Are (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
        <AboutWhoWeAre />
      </div>

      {/* Section 2 (Even): What We Offer (Warm Cream #F5F0E5) */}
      <div className="home-tonal-even">
        <AboutWhatWeOffer />
      </div>

      {/* Section 3 (Odd): Approach / phases (Dark Emerald #061C14) */}
      <div className="home-tonal-odd">
        <AboutApproach />
      </div>

      {/* Section 4 (Even): On-Site Showcase (Warm Cream #F5F0E5) */}
      <div className="home-tonal-even">
        <AboutShowcase />
      </div>

      {/* Section 5 (Odd): Closing CTA (Dark Emerald #061C14) */}
      <div className="home-tonal-odd about-cta-tonal-wrap">
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
