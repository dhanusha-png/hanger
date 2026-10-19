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

      {/* Section 2 (Even): Category Shortcuts (Light Cream) */}
      <div className="home-reveal" data-theme="warm">
        <CategoryShortcuts />
      </div>

      {/* Section 3 (Odd): Featured Solutions (Unchanged Old Dark) */}
      <div className="home-reveal">
        <FeaturedSolutions
          products={products}
          loading={productsLoading}
          error={productsError}
          onAdd={add}
          onWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
        />
      </div>

      {/* Section 4 (Even): Installation Showcase (Light Cream) */}
      <div className="home-reveal" data-theme="warm">
        <InstallationShowcase />
      </div>

      {/* Section 5 (Odd): Our Services (Unchanged Old Dark) */}
      <div className="home-reveal">
        <ServicesSection />
      </div>

      {/* Section 6 (Even): How It Works (Light Cream) */}
      <div className="home-reveal" data-theme="warm">
        <HowItWorks />
      </div>

      {/* Section 7 (Odd): Gallery Preview (Unchanged Old Dark) */}
      <div className="home-reveal">
        <GalleryPreview />
      </div>

      {/* Section 8 (Even): Final Premium Call to Action (Light Cream) */}
      <div className="home-reveal" data-theme="warm">
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
