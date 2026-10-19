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
      <AboutHero />
      <AboutWhoWeAre />
      <AboutWhatWeOffer />
      <AboutApproach />
      <AboutShowcase />
      <AboutCTA />
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
