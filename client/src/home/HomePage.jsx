import React, { useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { BenefitBar } from './BenefitBar';
import { CategoryShortcuts } from './CategoryShortcuts';
import { FeaturedSolutions } from './FeaturedSolutions';
import { InstallationShowcase } from './InstallationShowcase';
import { ServicesSection } from './ServicesSection';
import { HowItWorks } from './HowItWorks';
import { GalleryPreview } from './GalleryPreview';
import { HomeCTA } from './HomeCTA';
import { FloatingWidgets } from './FloatingWidgets';
import './home.css';

export function HomePage({
  products = [],
  productsLoading = false,
  productsError = false,
  cart = [],
  add = () => {},
  remove = () => {},
  updateQty = () => {},
  total = 0,
  chat = false,
  setChat = () => {},
  toggleWishlist = () => {},
  isInWishlist = () => false,
}) {
  // Find a prime featured ceiling hanger product from catalog for the hero floating card
  const heroFeaturedProduct = products.find(p => (
    p.category === 'Hangers' && (p.slug.includes('wall') || p.slug.includes('ceiling') || p.isFeatured)
  )) || products[0];

  // Scroll reveal observer for subtle, elegant section reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('home-in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const sections = document.querySelectorAll('.home-reveal');
    sections.forEach(s => observer.observe(s));

    return () => {
      sections.forEach(s => observer.unobserve(s));
    };
  }, [products]);

  return (
    <div className="home-page-container">
      {/* 1. Hero Section (Split Layout) */}
      <HeroSection featuredProduct={heroFeaturedProduct} />

      {/* 2. Benefit Bar (Overlapping Hero) */}
      <BenefitBar />

      {/* Section 1 (Odd): Category Shortcuts (Dark Emerald #061C14) */}
      <div className="home-reveal home-tonal-odd home-tonal-cat-shortcuts">
        <CategoryShortcuts />
      </div>

      {/* Section 2 (Even): Featured Solutions (Warm Cream #F5F0E5) */}
      <div className="home-reveal home-tonal-even">
        <FeaturedSolutions
          products={products}
          loading={productsLoading}
          error={productsError}
          onAdd={add}
          onWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
        />
      </div>

      {/* Section 3 (Odd): Installation Showcase (Dark Emerald #061C14) */}
      <div className="home-reveal home-tonal-odd">
        <InstallationShowcase />
      </div>

      {/* Section 4 (Even): Our Services Section (Warm Cream #F5F0E5) */}
      <div className="home-reveal home-tonal-even">
        <ServicesSection />
      </div>

      {/* Section 5 (Odd): How It Works (Dark Emerald #061C14) */}
      <div className="home-reveal home-tonal-odd">
        <HowItWorks />
      </div>

      {/* Section 6 (Even): Gallery Preview (Warm Cream #F5F0E5) */}
      <div className="home-reveal home-tonal-even">
        <GalleryPreview />
      </div>

      {/* Promotional CTA Banner (Dark Emerald & Gold Treatment) */}
      <div className="home-reveal home-tonal-odd home-cta-wrap">
        <HomeCTA />
      </div>

      {/* 10. Floating Actions (WhatsApp, Floating Cart & AI Assistant) */}
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
