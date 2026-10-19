import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Play,
  Phone,
  Search,
  X,
  Wrench,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { api, img } from './lib/api';
import { ProductsHero } from './products/ProductsHero';
import { ProductCatalogSidebar, matchProductLevel } from './products/ProductCatalogSidebar';
import { GalleryHero } from './gallery/GalleryHero';
import { FloatingWidgets } from './home/FloatingWidgets';
import './catalog.css';
import './products/products-hero.css';
import './products/product-sidebar.css';
import './gallery/gallery-hero.css';

function PageIntro({ eyebrow, title, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </section>
  );
}

function PublicState({ title, children, action }) {
  return (
    <div className="public-state">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export { HomePage } from './home/HomePage';

export function CatalogProductCard({ p, onAdd, onWishlist, isLiked, onBuyNow }) {
  const hasImage = Boolean(p.images?.[0]?.url);
  const phaseNumber = (p?._id ? p._id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : 1) % 6 + 1;

  return (
    <article className={`catalog-card animated-light-border light-product light-phase-${phaseNumber}`}>
      <div className="catalog-card-media-wrap" style={{ position: 'relative' }}>
        <Link to={`/products/${p.slug}`} className="catalog-card-media" aria-label={`View ${p.name}`}>
          {hasImage ? (
            <img src={img(p.images[0].url)} alt={p.images[0].alt || p.name} loading="lazy" />
          ) : (
            <div className="catalog-concept-media">
              <Boxes aria-hidden="true" />
              <span>{p.category}</span>
              <small>HangerHome Solution</small>
            </div>
          )}
          {p.isFeatured && <span className="catalog-featured-badge">Featured</span>}
          {p.compareAtPrice > p.price && (
            <span className="catalog-price-badge">
              Save ₹{Number(p.compareAtPrice - p.price).toLocaleString('en-IN')}
            </span>
          )}
        </Link>
        {onWishlist && (
          <button
            type="button"
            className={`catalog-wish-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlist(p);
            }}
            title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={isLiked ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          >
            <Heart fill={isLiked ? '#b54b42' : 'none'} color={isLiked ? '#b54b42' : 'currentColor'} size={17} />
          </button>
        )}
      </div>
      <div className="catalog-card-body">
        <div className="catalog-card-meta"><span>{p.category}</span><span>{p.modelName}</span></div>
        <Link to={`/products/${p.slug}`} className="catalog-card-title"><h3>{p.name}</h3></Link>
        <p>{p.shortDescription}</p>
        <div className="catalog-price-row">
          <strong>₹{Number(p.price || 0).toLocaleString('en-IN')}</strong>
          {p.compareAtPrice > p.price && <del>₹{Number(p.compareAtPrice).toLocaleString('en-IN')}</del>}
        </div>
        <small className="catalog-stock">In Stock ({p.stock} units)</small>
        <div className="catalog-card-actions">
          <button className="btn btn-soft" type="button" onClick={() => onAdd(p)}>Add to Cart</button>
          <button className="btn btn-primary" type="button" onClick={() => (onBuyNow ? onBuyNow(p) : onAdd(p))}>Buy Now</button>
        </div>
      </div>
    </article>
  );
}

export function ProductsPage({
  products = [],
  productsLoading = false,
  productsError = false,
  ProductCard,
  cart = [],
  total = 0,
  remove = () => {},
  updateQty = () => {},
  chat = false,
  setChat = () => {},
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [tag, setTag] = useState('All');

  // Side Catalog 3-Level State & Professional Filters
  const [selectedCat, setSelectedCat] = useState(() => {
    const pCat = searchParams.get('category');
    if (pCat === 'Hangers') return 'ceiling-hangers';
    if (pCat === 'Shoe Racks') return 'shoe-racks';
    if (pCat === 'Storage' || pCat === 'Storage Solutions') return 'storage-solutions';
    if (pCat) return pCat.toLowerCase().replace(/\s+/g, '-');
    return 'all';
  });
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync with hero category selection
  const selectCategoryFromHero = (heroCatName) => {
    if (heroCatName === 'All') {
      setSelectedCat('all');
      setSelectedSubCat(null);
      setSelectedType(null);
      setTag('All');
    } else if (heroCatName === 'Ceiling Hangers') {
      setSelectedCat('ceiling-hangers');
      setSelectedSubCat(null);
      setSelectedType(null);
    } else if (heroCatName === 'Wall Hangers') {
      setSelectedCat('wall-hangers');
      setSelectedSubCat(null);
      setSelectedType(null);
    } else if (heroCatName === 'Shoe Racks') {
      setSelectedCat('shoe-racks');
      setSelectedSubCat(null);
      setSelectedType(null);
    } else if (heroCatName === 'Storage Solutions') {
      setSelectedCat('storage-solutions');
      setSelectedSubCat(null);
      setSelectedType(null);
    } else if (heroCatName === 'Custom Solutions') {
      setSelectedCat('custom-solutions');
      setSelectedSubCat(null);
      setSelectedType(null);
    } else {
      setSelectedCat(heroCatName.toLowerCase().replace(/\s+/g, '-'));
      setSelectedSubCat(null);
      setSelectedType(null);
    }
  };

  // Human-readable labels for breadcrumbs
  const categoryLabels = {
    'all': 'All Products',
    'ceiling-hangers': 'Ceiling Hangers',
    'wall-hangers': 'Wall Hangers',
    'shoe-racks': 'Shoe Racks',
    'storage-solutions': 'Storage Solutions',
    'custom-solutions': 'Custom Solutions',
  };

  const formatBreadcrumbToken = (token) => {
    if (!token) return '';
    return token
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedCat('all');
    setSelectedSubCat(null);
    setSelectedType(null);
    setMaxPrice(4000);
    setInStockOnly(false);
    setMinRating(0);
    setQuery('');
    setTag('All');
  };

  // Master Visible Products Filter
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = products.filter(product => {
      // 1. 3-Level Category Tree match
      if (!matchProductLevel(product, selectedCat, selectedSubCat, selectedType)) {
        return false;
      }

      // 2. Max Price Filter
      const price = Number(product.price || 0);
      if (price > maxPrice) return false;

      // 3. Availability Filter (In Stock Only)
      if (inStockOnly && Number(product.stock || 0) <= 0) return false;

      // 4. Rating Filter (e.g. 4★ & up)
      if (minRating > 0) {
        const rating = Number(product.rating || 4.5);
        if (rating < minRating) return false;
      }

      // 5. Search Query
      if (normalizedQuery) {
        const searchable = [
          product.name,
          product.category,
          product.subCategory,
          product.modelName,
          product.sku,
          product.shortDescription,
          product.description,
          ...(product.tags || []),
        ].filter(Boolean).some(val => val.toLowerCase().includes(normalizedQuery));
        if (!searchable) return false;
      }

      return true;
    });

    return filtered.sort((left, right) => {
      if (sort === 'price-low') return left.price - right.price;
      if (sort === 'price-high') return right.price - left.price;
      if (sort === 'name') return left.name.localeCompare(right.name);
      return Number(right.isFeatured) - Number(left.isFeatured) || left.name.localeCompare(right.name);
    });
  }, [products, selectedCat, selectedSubCat, selectedType, maxPrice, inStockOnly, minRating, query, sort]);

  // Derived category label for hero sync
  const currentHeroCategory = selectedCat === 'ceiling-hangers'
    ? 'Ceiling Hangers'
    : selectedCat === 'wall-hangers'
    ? 'Wall Hangers'
    : selectedCat === 'shoe-racks'
    ? 'Shoe Racks'
    : selectedCat === 'storage-solutions'
    ? 'Storage Solutions'
    : selectedCat === 'custom-solutions'
    ? 'Custom Solutions'
    : 'All';

  return (
    <>
      {/* 1. Full-Bleed Viewport Centered Cinematic Hero + Search/Sort Bar + 6 Category Cards */}
      <ProductsHero
        products={products}
        query={query}
        setQuery={setQuery}
        sort={sort}
        setSort={setSort}
        category={currentHeroCategory}
        selectCategory={selectCategoryFromHero}
        tag={tag}
        setTag={setTag}
      />

      {/* 2. Professional Two-Column Catalog Section: Sticky Sidebar + Product Grid */}
      <section className="section container catalog-section" style={{ paddingTop: 0 }}>
        <div className="products-catalog-layout">
          {/* Desktop Sticky Left Glass Sidebar */}
          <ProductCatalogSidebar
            products={products}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            selectedSubCat={selectedSubCat}
            setSelectedSubCat={setSelectedSubCat}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            minRating={minRating}
            setMinRating={setMinRating}
            onResetFilters={handleResetFilters}
            onOpenChat={() => setChat(true)}
          />

          {/* Right Product Grid & Top Bar Column */}
          <div className="catalog-content-column">
            {/* Top Bar with Breadcrumbs, Results Count, Mobile Drawer Button, View Toggle & Sort */}
            <div className="catalog-header-bar">
              {/* Dynamic Breadcrumbs */}
              <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
                <Link to="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span
                  className="breadcrumb-link"
                  onClick={() => {
                    setSelectedCat('all');
                    setSelectedSubCat(null);
                    setSelectedType(null);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Products
                </span>

                {selectedCat !== 'all' && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <span
                      className={`breadcrumb-item ${!selectedSubCat && !selectedType ? 'breadcrumb-current' : 'breadcrumb-link'}`}
                      onClick={() => {
                        setSelectedSubCat(null);
                        setSelectedType(null);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {categoryLabels[selectedCat] || formatBreadcrumbToken(selectedCat)}
                    </span>
                  </>
                )}

                {selectedSubCat && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <span
                      className={`breadcrumb-item ${!selectedType ? 'breadcrumb-current' : 'breadcrumb-link'}`}
                      onClick={() => setSelectedType(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      {formatBreadcrumbToken(selectedSubCat)}
                    </span>
                  </>
                )}

                {selectedType && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">
                      {formatBreadcrumbToken(selectedType)}
                    </span>
                  </>
                )}
              </nav>

              {/* Header Right Controls */}
              <div className="catalog-header-controls">
                {/* Mobile Drawer Trigger Button */}
                <button
                  type="button"
                  className="mobile-drawer-toggle-btn"
                  onClick={() => setMobileDrawerOpen(true)}
                  aria-label="Open Filters and Catalog Drawer"
                >
                  <SlidersHorizontal size={14} />
                  <span>Filters & Catalog</span>
                </button>

                {/* Result count */}
                <div className="catalog-results-badge" aria-live="polite">
                  Showing <strong>{visibleProducts.length}</strong> of {products.length} products
                </div>

                {/* Grid vs List View Toggle */}
                <div className="view-mode-toggle" aria-label="View layout toggle">
                  <button
                    type="button"
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                    aria-label="List view"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Container (Grid or List View) */}
            {productsLoading ? (
              <PublicState title="Loading products">The current catalog is loading.</PublicState>
            ) : productsError ? (
              <PublicState title="Products are temporarily unavailable">Please try again shortly.</PublicState>
            ) : visibleProducts.length ? (
              <div className={`catalog-product-grid ${viewMode === 'list' ? 'list-view-mode' : ''}`}>
                {visibleProducts.map(product => (
                  <ProductCard key={product._id} p={product} />
                ))}
              </div>
            ) : (
              <PublicState
                title={products.length ? 'No matching products found' : 'No products are currently available'}
                action={
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleResetFilters}
                    style={{ marginTop: '14px' }}
                  >
                    <RotateCcw size={14} style={{ marginRight: '6px' }} />
                    Reset all filters
                  </button>
                }
              >
                {products.length
                  ? 'Try adjusting your category selection, increasing the price range, or clearing the search term.'
                  : 'Please check back later for current catalog availability.'}
              </PublicState>
            )}

            {!productsLoading && !productsError && products.length > 0 && (
              <div className="catalog-bottom-links" style={{ marginTop: '36px' }}>
                <Link className="text-link" to="/gallery">
                  Explore our installation gallery <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Slide-in Drawer from Left */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="mobile-drawer-panel"
            onClick={e => e.stopPropagation()}
          >
            <ProductCatalogSidebar
              products={products}
              selectedCat={selectedCat}
              setSelectedCat={setSelectedCat}
              selectedSubCat={selectedSubCat}
              setSelectedSubCat={setSelectedSubCat}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              minRating={minRating}
              setMinRating={setMinRating}
              onResetFilters={handleResetFilters}
              onOpenChat={() => {
                setMobileDrawerOpen(false);
                setChat(true);
              }}
              isDrawer={true}
              onCloseDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Action Buttons: WhatsApp, Cart, and Ask HangerHome */}
      <FloatingWidgets
        cart={cart}
        total={total}
        onRemove={remove}
        onUpdateQty={updateQty}
        chat={chat}
        setChat={setChat}
      />
    </>
  );
}

export function CatalogProductDetail({ slug, products, onAdd, toggleWishlist, isInWishlist, ProductCard }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let current = true;
    setLoading(true);
    setFailed(false);
    setSelectedImage(0);
    setQuantity(1);
    api(`/products/${slug}`)
      .then(result => {
        if (current) {
          setProduct(result.product);
          setReviews(result.reviews || []);
        }
      })
      .catch(() => {
        const catalogProduct = products.find(item => item.slug === slug);
        if (current) {
          setProduct(catalogProduct || null);
          setReviews([]);
          setFailed(!catalogProduct);
        }
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, [products, slug]);

  if (loading && !product) {
    return <div className="section container"><PublicState title="Loading product">Product details are loading from the catalog.</PublicState></div>;
  }
  if (!product) {
    return <div className="section container"><PublicState title={failed ? 'Product details are unavailable' : 'Product not found'} action={<Link to="/products" className="btn btn-primary">Back to Products</Link>}>{failed ? 'Please return to the catalog and try again.' : 'This product is not available in the current catalog.'}</PublicState></div>;
  }

  const images = product.images || [];
  const relatedProducts = products
    .filter(item => item.category === product.category && item._id !== product._id)
    .slice(0, 4);
  const stock = Number(product.stock || 0);
  const isSaved = isInWishlist ? isInWishlist(product._id) : false;

  return (
    <>
      <div className="section container">
        <Link className="catalog-back-link" to="/products"><ArrowRight aria-hidden="true" /> Back to Products</Link>
        <section className="catalog-detail">
          <div className="catalog-detail-gallery">
            <div className="catalog-detail-main">
              {images.length ? <img src={img(images[selectedImage]?.url)} alt={images[selectedImage]?.alt || product.name} /> : (
                <div className="catalog-concept-media detail">
                  <Boxes aria-hidden="true" />
                  <span>{product.category}</span>
                  <small>HangerHome Solution</small>
                </div>
              )}
            </div>
            {images.length > 1 && <div className="catalog-thumbnails" aria-label="Product photo views">
              {images.map((image, index) => (
                <button className={index === selectedImage ? 'active' : ''} key={image.url} onClick={() => setSelectedImage(index)} aria-label={`Show photo ${index + 1}`}>
                  <img src={img(image.url)} alt="" loading="lazy" />
                </button>
              ))}
            </div>}
            {product.video && <div className="catalog-detail-video">
              <h2>Product video</h2>
              <video controls preload="metadata" poster={images[0] ? img(images[0].url) : undefined}>
                <source src={product.video} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            </div>}
          </div>
          <div className="catalog-detail-info">
            <span className="eyebrow">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="catalog-model-line">
              <span>Model:</span><strong>{product.modelName}</strong>
              <span>SKU:</span><strong>{product.sku}</strong>
            </div>
            <div className="catalog-detail-price">
              <strong>₹{Number(product.price || 0).toLocaleString('en-IN')}</strong>
              {product.compareAtPrice > product.price && (
                <>
                  <del>₹{Number(product.compareAtPrice).toLocaleString('en-IN')}</del>
                  <span className="catalog-save-badge">Save ₹{(product.compareAtPrice - product.price).toLocaleString('en-IN')}</span>
                </>
              )}
            </div>
            <p className="catalog-detail-summary">{product.shortDescription}</p>
            <p className="catalog-stock-detail">Availability: {stock > 0 ? `${stock} units in stock` : 'Out of stock'}</p>
            <label className="catalog-quantity">Quantity
              <span><button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button><input type="number" min="1" max={Math.max(1, stock)} value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(stock || 1, Number(event.target.value) || 1)))} /><button type="button" onClick={() => setQuantity(value => Math.min(stock || value + 1, value + 1))} aria-label="Increase quantity">+</button></span>
            </label>
            <div className="catalog-detail-actions">
              <button className="btn btn-soft btn-lg animated-light-button light-hero-btn light-phase-2" type="button" disabled={stock <= 0} onClick={() => onAdd(product, quantity)}>Add to Cart</button>
              <Link className="btn btn-primary btn-lg animated-light-button light-hero-btn light-phase-1" to={`/checkout?buy=${product._id}`}>Buy Now</Link>
              {toggleWishlist && (
                <button
                  className={`btn btn-soft btn-lg ${isSaved ? 'liked' : ''}`}
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                  title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart fill={isSaved ? "#b54b42" : "none"} color={isSaved ? "#b54b42" : "currentColor"} size={17} />
                  <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                </button>
              )}
            </div>
            <div className="catalog-detail-features">
              <h2>Key Features</h2>
              <ul>{(product.features || []).map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
            </div>
          </div>
        </section>
        <section className="catalog-detail-sections">
          <div><span className="eyebrow">OVERVIEW</span><h2>Description</h2><p>{product.description}</p></div>
          <div><span className="eyebrow">DETAILS</span><h2>Specifications</h2>
            {product.specifications?.length ? <dl>{product.specifications.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl> : <p>Detailed specifications available upon request.</p>}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="section" style={{ borderTop: '1px solid var(--line)', marginTop: '48px', paddingTop: '48px' }}>
          <div className="section-title">
            <small>CUSTOMER REVIEWS</small>
            <h2>Verified Feedback</h2>
          </div>
          {reviews.length === 0 ? (
            <div className="empty review-empty">
              <Star size={30} style={{ color: '#C8A86B', margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '18px', margin: '0 0 6px' }}>No reviews yet</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Be the first customer to share feedback on this product after installation.</p>
            </div>
          ) : (
            <div className="review-grid">
              {reviews.map(r => (
                <div className="review-card" key={r._id}>
                  <div className="review-head">
                    <div className="avatar">{r.name?.[0] || 'U'}</div>
                    <div>
                      <b>{r.name}</b>
                      {r.verified && <small style={{ color: '#0e5b4b', fontWeight: 700 }}>✓ Verified Purchase</small>}
                    </div>
                  </div>
                  {r.title && <h4 style={{ margin: '12px 0 6px' }}>{r.title}</h4>}
                  <p>{r.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {relatedProducts.length > 0 && <section className="section container catalog-related">
        <div className="section-title"><small>EXPLORE MORE</small><h2>Related Products</h2><p>Discover more designs from our {product.category} collection.</p></div>
        <div className="catalog-product-grid">{relatedProducts.map(item => <ProductCard key={item._id} p={item} />)}</div>
      </section>}
    </>
  );
}


export function GalleryPage({
  cart = [],
  total = 0,
  remove = () => {},
  updateQty = () => {},
  chat = false,
  setChat = () => {},
}) {
  const [category, setCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(null);
  const [customLightbox, setCustomLightbox] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const fallbackImages = useMemo(() => [1,2,3,4,5,6,7,8].map(i => ({
    src: `/media/hanger-${i}.jpg`,
    title: `HangerHome installation ${i}`,
    category: 'Hangers'
  })), []);
  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    api('/content/gallery').then(result => {
      if (Array.isArray(result?.items) && result.items.length) setImages(result.items);
    }).catch(() => {});
  }, []);

  const visibleImages = category === 'All' ? images : images.filter(item => item.category === category);
  const availableCategories = useMemo(() => ['All', ...Array.from(new Set(images.map(item => item.category).filter(Boolean)))], [images]);

  useEffect(() => {
    setActiveIndex(null);
    setCustomLightbox(null);
  }, [category]);

  const handleHeroCardClick = (src, title) => {
    const foundIndex = visibleImages.findIndex(img => img.src === src);
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    } else {
      setCustomLightbox({ src, title });
    }
  };

  useEffect(() => {
    if (activeIndex === null && customLightbox === null) return undefined;
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
        setCustomLightbox(null);
      }
      if (activeIndex !== null) {
        if (event.key === 'ArrowLeft') setActiveIndex(index => (index - 1 + visibleImages.length) % visibleImages.length);
        if (event.key === 'ArrowRight') setActiveIndex(index => (index + 1) % visibleImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, customLightbox, visibleImages.length]);

  return (
    <>
      {/* 1. Target Gallery Hero Panel with 3D Tilted Photo Cards, Golden Streak, Flare, Filter Chips, and Heading */}
      <GalleryHero
        onCardClick={handleHeroCardClick}
        category={category}
        setCategory={setCategory}
        categories={availableCategories}
        totalPhotos={visibleImages.length}
      />

      <section className="section container catalog-gallery-page" style={{ paddingTop: '10px' }}>
        {visibleImages.length ? (
          <div className="catalog-gallery-grid">
            {visibleImages.map((image, index) => (
              <button className="catalog-gallery-item" type="button" key={image.src} onClick={() => setActiveIndex(index)} aria-label={`Open ${image.title}, photo ${index + 1}`}>
                <img src={img(image.src)} alt={`${image.title}, reference photo ${index + 1}`} loading="lazy" />
                <span>{image.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <PublicState title="Shoe Rack Installations">
            On-site photography for our shoe rack installations is currently being updated. You can view our ceiling hanger installations above or explore our products catalog.
          </PublicState>
        )}
        {category !== 'Shoe Racks' && (
          <section className="catalog-video-section">
            <div className="catalog-gallery-heading">
              <div>
                <span className="eyebrow">PRODUCT VIDEOS</span>
                <h2>Installation in motion</h2>
              </div>
            </div>
            <button className="catalog-video-card" type="button" onClick={() => setVideoOpen(true)}>
              <img src="/media/hanger-1.jpg" alt="" loading="lazy" />
              <span className="catalog-video-play"><Play fill="currentColor" aria-hidden="true" /></span>
              <span className="catalog-video-caption">
                <strong>Ceiling Hanger System in Action</strong>
                <small>Smooth pulley mechanism &amp; installation video · Hangers</small>
              </span>
            </button>
          </section>
        )}
      </section>

      {/* Lightbox Viewer */}
      {(activeIndex !== null || customLightbox !== null) && (
        <div
          className="catalog-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Installation photo viewer"
          onClick={() => { setActiveIndex(null); setCustomLightbox(null); }}
        >
          <button
            className="catalog-lightbox-close"
            type="button"
            onClick={() => { setActiveIndex(null); setCustomLightbox(null); }}
            aria-label="Close image viewer"
          >
            <X />
          </button>
          {activeIndex !== null && (
            <button
              className="catalog-lightbox-prev"
              type="button"
              onClick={event => { event.stopPropagation(); setActiveIndex(index => (index - 1 + visibleImages.length) % visibleImages.length); }}
              aria-label="Previous photo"
            >
              <ChevronLeft />
            </button>
          )}
          <figure onClick={event => event.stopPropagation()}>
            <img
              src={customLightbox ? img(customLightbox.src) : img(visibleImages[activeIndex].src)}
              alt={customLightbox ? customLightbox.title : `${visibleImages[activeIndex].title}, photo ${activeIndex + 1}`}
            />
            <figcaption>
              {customLightbox ? customLightbox.title : `${visibleImages[activeIndex].title} · Photo ${activeIndex + 1} of ${visibleImages.length}`}
            </figcaption>
          </figure>
          {activeIndex !== null && (
            <button
              className="catalog-lightbox-next"
              type="button"
              onClick={event => { event.stopPropagation(); setActiveIndex(index => (index + 1) % visibleImages.length); }}
              aria-label="Next photo"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      )}

      {/* Video Demonstration Modal */}
      {videoOpen && (
        <div className="catalog-lightbox catalog-video-modal" role="dialog" aria-modal="true" aria-label="Hanger installation video" onClick={() => setVideoOpen(false)}>
          <button className="catalog-lightbox-close" type="button" onClick={() => setVideoOpen(false)} aria-label="Close video"><X /></button>
          <video controls autoPlay poster="/media/hanger-1.jpg" onClick={event => event.stopPropagation()}>
            <source src="/media/hanger-demo.mp4" type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>
      )}

      {/* Floating Action Buttons: WhatsApp, Cart, and Ask HangerHome */}
      <FloatingWidgets
        cart={cart}
        total={total}
        onRemove={remove}
        onUpdateQty={updateQty}
        chat={chat}
        setChat={setChat}
      />
    </>
  );
}

export function SearchPage({ products, productsLoading, productsError, ProductCard }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const normalizedQuery = (searchParams.get('q') || '').trim().toLocaleLowerCase();
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return products.filter(product => (
      [
        product.name,
        product.category,
        product.modelName,
        product.sku,
        product.shortDescription,
        product.description,
        ...(product.tags || []),
      ]
        .filter(Boolean)
        .some(value => value.toLocaleLowerCase().includes(normalizedQuery))
    ));
  }, [products, normalizedQuery]);

  function submit(event) {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (query.trim()) nextParams.set('q', query.trim());
    else nextParams.delete('q');
    setSearchParams(nextParams);
  }

  return (
    <>
      <PageIntro eyebrow="SEARCH" title="Search products">
        Search the current catalog by product name, category or description.
      </PageIntro>
      <section className="section container">
        <form className="public-search-form" role="search" onSubmit={submit}>
          <label htmlFor="public-product-search">Search the catalog</label>
          <div className="public-search-controls">
            <input
              id="public-product-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Enter a product or category"
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>
        {!normalizedQuery ? (
          <PublicState title="Enter a search term">Results will be shown from products currently in the catalog.</PublicState>
        ) : productsLoading ? (
          <PublicState title="Searching products">The current catalog is loading.</PublicState>
        ) : productsError ? (
          <PublicState title="Search is temporarily unavailable">The product catalog could not be loaded. Please try again shortly.</PublicState>
        ) : results.length ? (
          <div className="public-search-results">
            <p>{results.length} {results.length === 1 ? 'result' : 'results'} for “{searchParams.get('q')}”</p>
            <div className="product-grid">{results.map(product => <ProductCard key={product._id} p={product} />)}</div>
          </div>
        ) : (
          <PublicState
            title="No matching products"
            action={<Link to="/products" className="btn btn-soft">Browse Products</Link>}
          >
            No current catalog products match “{searchParams.get('q')}”.
          </PublicState>
        )}
      </section>
    </>
  );
}

export { InstallationsPage } from './installations/InstallationsPage';


export { AboutPage } from './about/AboutPage';


export { ContactPage } from './contact/ContactPage';


export { WishlistPage } from './wishlist/WishlistPage';

