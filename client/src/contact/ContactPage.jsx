import React, { useState, useEffect } from 'react';
import { ContactHero } from './ContactHero';
import { ContactInfoCards } from './ContactInfoCards';
import { ContactForm } from './ContactForm';
import { ContactActionCards } from './ContactActionCards';
import { ContactFAQ } from './ContactFAQ';
import { ContactClosingCTA } from './ContactClosingCTA';
import { FloatingWidgets } from '../home/FloatingWidgets';
import { api } from '../lib/api';
import './contact.css';

const isPublished = val => (
  typeof val === 'string' &&
  val.trim().length > 0 &&
  !/not configured|example\.com|000000/i.test(val)
);

export function ContactPage({ cart = [], total = 0, remove, updateQty, chat, setChat }) {
  const [site, setSite] = useState(null);
  const [productCount, setProductCount] = useState(20);
  const [selectedReq, setSelectedReq] = useState('');

  useEffect(() => {
    document.title = 'Contact Us | HangerHome';

    // Fetch site branding & contact details
    api('/content/site')
      .then(setSite)
      .catch(() => {});

    // Fetch products to count catalog items dynamically
    api('/products')
      .then(prods => {
        if (Array.isArray(prods) && prods.length > 0) {
          setProductCount(prods.length);
        }
      })
      .catch(() => {});
  }, []);

  const phone = isPublished(site?.phone) ? site.phone : '';
  const whatsapp = isPublished(site?.whatsapp) ? site.whatsapp : '';
  const email = isPublished(site?.email) ? site.email : '';
  const address = isPublished(site?.address) ? site.address : '';
  const serviceAreas = isPublished(site?.serviceAreas) ? site.serviceAreas : '';

  return (
    <div className="contact-page-root">
      {/* 1. COMPACT HERO (Text Only, No Photos) */}
      <ContactHero
        phone={phone}
        whatsapp={whatsapp}
        email={email}
      />

      <div className="container contact-main-container">
        {/* 2. TWO-COLUMN SPLIT: Sticky Details (40%) + Enquiry Form (60%) */}
        <div className="contact-two-column-split">
          {/* Left Details Column */}
          <div className="contact-col-details">
            <ContactInfoCards
              phone={phone}
              whatsapp={whatsapp}
              email={email}
              address={address}
              serviceAreas={serviceAreas}
            />
          </div>

          {/* Right Form Column */}
          <div className="contact-col-form">
            <ContactForm
              preselectedRequirement={selectedReq}
            />
          </div>
        </div>

        {/* 3. THREE ACTION CARDS */}
        <ContactActionCards
          productCount={productCount}
          onRequestQuote={(req) => setSelectedReq(req)}
        />

        {/* 4. FREQUENTLY ASKED QUESTIONS */}
        <ContactFAQ />

        {/* 5. CLOSING CTA BAND */}
        <ContactClosingCTA
          phone={phone}
          whatsapp={whatsapp}
        />
      </div>

      {/* Floating Action Buttons (Cart, WhatsApp, Chatbot) */}
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
