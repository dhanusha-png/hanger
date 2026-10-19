import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CategoryShortcuts() {
  const categories = [
    {
      title: 'Hangers',
      label: 'Explore Collection',
      link: '/products?category=Hangers',
      image: '/products/hanger-deluxe-freestanding.jpg',
      alt: 'Premium Hanger Collection',
    },
    {
      title: 'Shoe Racks',
      label: 'Explore Collection',
      link: '/products?category=Shoe Racks',
      image: '/products/shoe-rack-premium-4-tier.jpg',
      alt: 'Handcrafted Shoe Racks',
    },
    {
      title: 'Custom Solutions',
      label: 'Tailored for your space',
      link: '/quote',
      image: '/media/hanger-4.jpg',
      alt: 'Custom Space Solutions',
    },
  ];

  return (
    <section className="home-categories-section container" aria-label="Product Categories">
      <div className="home-categories-grid">
        {categories.map((cat, idx) => (
          <Link to={cat.link} className="home-category-card" key={idx}>
            <div className="home-category-thumb">
              <img src={cat.image} alt={cat.alt} loading="lazy" />
            </div>
            <div className="home-category-info">
              <h3 className="home-category-title">{cat.title}</h3>
              <span className="home-category-link">
                {cat.label} <ArrowRight size={14} className="home-category-arrow" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
