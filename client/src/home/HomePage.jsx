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

      {/* Section 1: Category Shortcuts (First section after hero: Warm Cream #F5F0E5) */}
      <div className="home-reveal home-tonal-even">
        <CategoryShortcuts />
      </div>

      {/* Section 2: Featured Solutions (Next section: Dark Emerald #061C14) */}
      <div className="home-reveal home-tonal-odd">
        <FeaturedSolutions
          products={products}
          loading={productsLoading}
          error={productsError}
          onAdd={add}
          onWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
        />
      </div>

      {/* Section 3: Installation Showcase (Next section: Warm Cream #F5F0E5) */}
      <div className="home-reveal home-tonal-even">
        <InstallationShowcase />
      </div>

      {/* Section 4: Our Services Section (Next section: Dark Emerald #061C14) */}
      <div className="home-reveal home-tonal-odd">
        <ServicesSection />
      </div>

      {/* Section 5: How It Works (Next section: Warm Cream #F5F0E5) */}
      <div className="home-reveal home-tonal-even">
        <HowItWorks />
      </div>

      {/* Section 6: Gallery Preview (Next section: Dark Emerald #061C14) */}
      <div className="home-reveal home-tonal-odd">
        <GalleryPreview />
      </div>

      {/* Section 7: Smarter Space CTA (Warm Cream #F5F0E5 - Alternating Palette) */}
      <div className="home-reveal home-tonal-even home-cta-wrap">
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
