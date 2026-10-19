import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Filter,
  RotateCcw,
  Star,
  Check,
  MessageCircle,
  X,
  SlidersHorizontal,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  HangerIcon,
  CeilingPulleyIcon,
  WallHangerIcon,
  ShoeIcon,
  StorageBoxIcon,
  RulerTriangleIcon
} from './ProductsHero';

// Helper matching logic that prioritizes real product fields (category, subCategory, type)
// and gracefully falls back to intelligent tag/name matching
export function matchProductLevel(product, catId, subCatId, typeId) {
  if (!product) return false;
  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const subCat = (product.subCategory || '').toLowerCase();
  const pType = (product.type || product.productType || '').toLowerCase();
  const tags = (product.tags || []).map(t => t.toLowerCase());
  const allText = `${name} ${cat} ${subCat} ${pType} ${tags.join(' ')} ${(product.shortDescription || '')}`.toLowerCase();

  // 1. Level 1 Match
  if (catId && catId !== 'all') {
    if (catId === 'ceiling-hangers') {
      const isCeiling = cat === 'ceiling hangers' ||
        subCat.includes('ceiling') ||
        (cat === 'hangers' && (allText.includes('ceiling') || allText.includes('balcony') || allText.includes('pulley') || allText.includes('retractable')));
      if (!isCeiling) return false;
    } else if (catId === 'wall-hangers') {
      const isWall = cat === 'wall hangers' ||
        subCat.includes('wall') ||
        (cat === 'hangers' && (allText.includes('wall') || allText.includes('foldable') || allText.includes('extendable') || allText.includes('drying') || allText.includes('freestanding')));
      if (!isWall) return false;
    } else if (catId === 'shoe-racks') {
      if (cat !== 'shoe racks' && !name.includes('shoe')) return false;
    } else if (catId === 'storage-solutions') {
      const isStorage = cat.includes('storage') ||
        subCat.includes('storage') ||
        allText.includes('storage') ||
        allText.includes('organizer') ||
        allText.includes('modular') ||
        allText.includes('stand');
      if (!isStorage) return false;
    } else if (catId === 'custom-solutions') {
      const isCustom = cat.includes('custom') ||
        allText.includes('custom') ||
        allText.includes('deluxe') ||
        allText.includes('heavy duty');
      if (!isCustom) return false;
    }
  }

  // 2. Level 2 Match
  if (subCatId) {
    if (subCat && subCat.includes(subCatId.toLowerCase())) {
      // Direct field match
    } else {
      // Fallback matching
      switch (subCatId) {
        case 'retractable':
          if (!allText.includes('retractable') && !allText.includes('extendable') && !allText.includes('balcony')) return false;
          break;
        case 'pulley-type':
          if (!allText.includes('pulley') && !allText.includes('balcony') && !allText.includes('tier') && !allText.includes('adjustable')) return false;
          break;
        case 'stainless-steel':
          if (!allText.includes('stainless') && !allText.includes('steel') && !allText.includes('metal')) return false;
          break;
        case 'balcony-systems':
          if (!allText.includes('balcony') && !allText.includes('space saver')) return false;
          break;
        case 'foldable':
          if (!allText.includes('foldable') && !allText.includes('folding')) return false;
          break;
        case 'fixed':
          if (!allText.includes('fixed') && !allText.includes('freestanding') && !allText.includes('stand')) return false;
          break;
        case 'cloth-drying':
          if (!allText.includes('drying') && !allText.includes('rack')) return false;
          break;
        case 'wall-mounted-shoes':
          if (!allText.includes('wall') && !allText.includes('slim') && !allText.includes('compact')) return false;
          break;
        case 'floor-standing':
          if (!allText.includes('multi-tier') && !allText.includes('stand') && !allText.includes('tall') && !allText.includes('modern')) return false;
          break;
        case 'cabinets':
          if (!allText.includes('storage') && !allText.includes('family') && !allText.includes('metal')) return false;
          break;
        case 'boxes-baskets':
          if (!allText.includes('box') && !allText.includes('basket') && !allText.includes('modular') && !allText.includes('compact')) return false;
          break;
        case 'shelves':
          if (!allText.includes('shelf') && !allText.includes('tier') && !allText.includes('wall')) return false;
          break;
        case 'hooks-accessories':
          if (!allText.includes('hook') && !allText.includes('peg') && !allText.includes('stand') && !allText.includes('valet')) return false;
          break;
        default:
          if (!allText.includes(subCatId.replace('-', ' '))) return false;
      }
    }
  }

  // 3. Level 3 Match
  if (typeId) {
    if (pType && pType.includes(typeId.toLowerCase())) {
      // Direct match
    } else {
      switch (typeId) {
        case '4-rod':
          if (!allText.includes('compact') && !name.includes('4')) return false;
          break;
        case '6-rod':
          if (!allText.includes('multi-tier') && !name.includes('6') && !allText.includes('adjustable')) return false;
          break;
        case 'motorised':
          if (!allText.includes('deluxe') && !allText.includes('motor')) return false;
          break;
        case 'heavy-duty':
          if (!allText.includes('heavy duty')) return false;
          break;
        case 'dual-pulley':
          if (!allText.includes('adjustable') && !allText.includes('tier')) return false;
          break;
        case 'compact-pulley':
          if (!allText.includes('compact')) return false;
          break;
        case 'marine-grade':
          if (!allText.includes('stainless')) return false;
          break;
        case 'chrome-finish':
          if (!allText.includes('premium')) return false;
          break;
        case 'compact-fold':
          if (!allText.includes('compact') && !allText.includes('foldable')) return false;
          break;
        case 'rail-mounted':
          if (!allText.includes('wall') && !allText.includes('mounted')) return false;
          break;
        case '2-tier':
          if (!allText.includes('compact') && !name.includes('2')) return false;
          break;
        case 'multi-tier':
          if (!allText.includes('multi-tier')) return false;
          break;
        case 'accordion':
          if (!allText.includes('extendable')) return false;
          break;
        case '3-tier-wall':
          if (!name.includes('3-Tier') && !allText.includes('compact')) return false;
          break;
        case '4-tier-wall':
          if (!name.includes('4-Tier') && !allText.includes('angled')) return false;
          break;
        case 'multi-level':
          if (!allText.includes('multi-level') && !name.includes('5-Tier')) return false;
          break;
        case 'slim-entryway':
          if (!allText.includes('entryway') && !allText.includes('slim')) return false;
          break;
        case 'bamboo-wood':
          if (!allText.includes('bamboo') && !allText.includes('wood')) return false;
          break;
        case 'family-storage':
          if (!allText.includes('family')) return false;
          break;
        case 'modular-stand':
          if (!allText.includes('modular') && !allText.includes('metal')) return false;
          break;
        default:
          if (!allText.includes(typeId.replace('-', ' '))) return false;
      }
    }
  }

  return true;
}

// 3-Level Category Tree Blueprint
const CATALOG_TREE_STRUCTURE = [
  {
    id: 'all',
    name: 'All Products',
    icon: HangerIcon,
    subCategories: [],
  },
  {
    id: 'ceiling-hangers',
    name: 'Ceiling Hangers',
    icon: CeilingPulleyIcon,
    subCategories: [
      {
        id: 'retractable',
        name: 'Retractable',
        items: [
          { id: '4-rod', name: '4-Rod' },
          { id: '6-rod', name: '6-Rod' },
          { id: 'motorised', name: 'Motorised' },
        ],
      },
      {
        id: 'pulley-type',
        name: 'Pulley Type',
        items: [
          { id: 'heavy-duty', name: 'Heavy Duty' },
          { id: 'dual-pulley', name: 'Dual Pulley' },
          { id: 'compact-pulley', name: 'Compact' },
        ],
      },
      {
        id: 'stainless-steel',
        name: 'Stainless Steel',
        items: [
          { id: 'marine-grade', name: 'Marine Grade' },
          { id: 'chrome-finish', name: 'Chrome Finish' },
        ],
      },
      {
        id: 'balcony-systems',
        name: 'Balcony Systems',
        items: [
          { id: 'compact-fold', name: 'Compact Fold' },
          { id: 'rail-mounted', name: 'Rail-Mounted' },
        ],
      },
    ],
  },
  {
    id: 'wall-hangers',
    name: 'Wall Hangers',
    icon: WallHangerIcon,
    subCategories: [
      {
        id: 'foldable',
        name: 'Foldable',
        items: [
          { id: '2-tier', name: '2-Tier' },
          { id: 'multi-tier', name: 'Multi-Tier' },
          { id: 'accordion', name: 'Accordion' },
        ],
      },
      {
        id: 'fixed',
        name: 'Fixed',
        items: [
          { id: 'heavy-duty-fixed', name: 'Heavy Duty' },
          { id: 'wall-valet', name: 'Wall Valet' },
        ],
      },
      {
        id: 'cloth-drying',
        name: 'Cloth Drying',
        items: [
          { id: 'extendable-dry', name: 'Extendable' },
          { id: 'hanging-rack', name: 'Hanging Rack' },
        ],
      },
    ],
  },
  {
    id: 'shoe-racks',
    name: 'Shoe Racks',
    icon: ShoeIcon,
    subCategories: [
      {
        id: 'wall-mounted-shoes',
        name: 'Wall Mounted',
        items: [
          { id: '3-tier-wall', name: '3-Tier' },
          { id: '4-tier-wall', name: '4-Tier' },
        ],
      },
      {
        id: 'floor-standing',
        name: 'Floor Standing',
        items: [
          { id: 'multi-level', name: 'Multi-Level' },
          { id: 'slim-entryway', name: 'Slim Entryway' },
          { id: 'bamboo-wood', name: 'Bamboo / Wood' },
        ],
      },
      {
        id: 'cabinets',
        name: 'Cabinets',
        items: [
          { id: 'family-storage', name: 'Family Storage' },
          { id: 'modular-stand', name: 'Modular Stand' },
        ],
      },
    ],
  },
  {
    id: 'storage-solutions',
    name: 'Storage Solutions',
    icon: StorageBoxIcon,
    subCategories: [
      {
        id: 'boxes-baskets',
        name: 'Boxes & Baskets',
        items: [
          { id: 'woven-baskets', name: 'Woven Baskets' },
          { id: 'fabric-bins', name: 'Fabric Bins' },
        ],
      },
      {
        id: 'shelves',
        name: 'Shelves',
        items: [
          { id: 'floating-shelves', name: 'Floating Shelves' },
          { id: 'modular-shelving', name: 'Modular Shelving' },
        ],
      },
      {
        id: 'hooks-accessories',
        name: 'Hooks & Accessories',
        items: [
          { id: 'coat-valet', name: 'Coat Valet' },
          { id: 'wall-pegs', name: 'Wall Pegs' },
        ],
      },
    ],
  },
  {
    id: 'custom-solutions',
    name: 'Custom Solutions',
    icon: RulerTriangleIcon,
    subCategories: [
      {
        id: 'balcony-custom',
        name: 'Balcony Customization',
        items: [
          { id: 'ceiling-fit', name: 'Ceiling Fit' },
        ],
      },
      {
        id: 'walk-in-closets',
        name: 'Walk-in Closets',
        items: [
          { id: 'wardrobe-systems', name: 'Wardrobe Systems' },
        ],
      },
      {
        id: 'heavy-duty-utility',
        name: 'Heavy-Duty Utility',
        items: [
          { id: 'industrial-grade', name: 'Industrial Grade' },
        ],
      },
    ],
  },
];

export function ProductCatalogSidebar({
  products = [],
  selectedCat = 'all',
  setSelectedCat = () => {},
  selectedSubCat = null,
  setSelectedSubCat = () => {},
  selectedType = null,
  setSelectedType = () => {},
  maxPrice = 4000,
  setMaxPrice = () => {},
  inStockOnly = false,
  setInStockOnly = () => {},
  minRating = 0,
  setMinRating = () => {},
  onResetFilters = () => {},
  onOpenChat = () => {},
  isDrawer = false,
  onCloseDrawer = () => {},
}) {
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCat, setExpandedCat] = useState(() => {
    return selectedCat !== 'all' ? selectedCat : 'ceiling-hangers';
  });
  const [expandedSubCat, setExpandedSubCat] = useState(null);

  // Compute live counts derived from real catalog data
  const countsMap = useMemo(() => {
    const map = {
      level1: {},
      level2: {},
      level3: {},
    };

    CATALOG_TREE_STRUCTURE.forEach(cat => {
      const catCount = products.filter(p => matchProductLevel(p, cat.id, null, null)).length;
      map.level1[cat.id] = catCount;

      (cat.subCategories || []).forEach(sub => {
        const subCount = products.filter(p => matchProductLevel(p, cat.id, sub.id, null)).length;
        map.level2[`${cat.id}-${sub.id}`] = subCount;

        (sub.items || []).forEach(it => {
          const itCount = products.filter(p => matchProductLevel(p, cat.id, sub.id, it.id)).length;
          map.level3[`${cat.id}-${sub.id}-${it.id}`] = itCount;
        });
      });
    });

    return map;
  }, [products]);

  // Filter category tree items with the small catalog search box
  const filteredTree = useMemo(() => {
    const term = catalogSearch.trim().toLowerCase();
    if (!term) return CATALOG_TREE_STRUCTURE;

    return CATALOG_TREE_STRUCTURE.map(cat => {
      const catMatch = cat.name.toLowerCase().includes(term);
      const filteredSubs = (cat.subCategories || []).map(sub => {
        const subMatch = sub.name.toLowerCase().includes(term);
        const filteredItems = (sub.items || []).filter(it => it.name.toLowerCase().includes(term));
        if (subMatch || filteredItems.length > 0) {
          return { ...sub, items: filteredItems.length > 0 ? filteredItems : sub.items };
        }
        return null;
      }).filter(Boolean);

      if (catMatch || filteredSubs.length > 0) {
        return {
          ...cat,
          subCategories: filteredSubs.length > 0 ? filteredSubs : cat.subCategories,
        };
      }
      return null;
    }).filter(Boolean);
  }, [catalogSearch]);

  const handleCategoryClick = (catId) => {
    if (expandedCat === catId) {
      // Toggle or keep selected
    } else {
      setExpandedCat(catId);
    }
    setSelectedCat(catId);
    setSelectedSubCat(null);
    setSelectedType(null);
  };

  const handleSubCatClick = (catId, subId, e) => {
    e.stopPropagation();
    if (expandedSubCat === subId) {
      setExpandedSubCat(null);
    } else {
      setExpandedSubCat(subId);
    }
    setSelectedCat(catId);
    setSelectedSubCat(subId);
    setSelectedType(null);
  };

  const handleTypeClick = (catId, subId, typeId, e) => {
    e.stopPropagation();
    setSelectedCat(catId);
    setSelectedSubCat(subId);
    setSelectedType(typeId);
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    setSelectedCat('all');
    setSelectedSubCat(null);
    setSelectedType(null);
    setExpandedSubCat(null);
  };

  return (
    <aside className={`product-catalog-sidebar ${isDrawer ? 'drawer-mode' : 'sticky-sidebar'}`}>
      <div className="sidebar-glass-panel conic-sidebar-glow">
        <div className="sidebar-conic-glow-border" />

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <span className="sidebar-header-icon">
              <Layers size={17} />
            </span>
            <h3 className="sidebar-title">Catalog</h3>
          </div>

          <div className="sidebar-header-actions">
            {(selectedCat !== 'all' || selectedSubCat || selectedType) && (
              <button
                type="button"
                className="sidebar-clear-link"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            )}
            {isDrawer && (
              <button
                type="button"
                className="sidebar-close-btn"
                onClick={onCloseDrawer}
                aria-label="Close catalog filters"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Small Search Box for Filtering the Category Tree */}
        <div className="sidebar-search-box">
          <Search size={14} className="sidebar-search-icon" />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search catalog..."
            value={catalogSearch}
            onChange={e => setCatalogSearch(e.target.value)}
            aria-label="Search catalog categories"
          />
          {catalogSearch && (
            <button
              type="button"
              className="sidebar-search-clear"
              onClick={() => setCatalogSearch('')}
            >
              ×
            </button>
          )}
        </div>

        {/* 3-Level Animated Accordion Category Tree */}
        <nav className="catalog-tree-nav" aria-label="Catalog hierarchy">
          {filteredTree.map(cat => {
            const IconComp = cat.icon || HangerIcon;
            const isCatActive = selectedCat === cat.id && !selectedSubCat && !selectedType;
            const isCatExpanded = expandedCat === cat.id || Boolean(catalogSearch);
            const count = countsMap.level1[cat.id] ?? 0;
            const hasSubs = (cat.subCategories || []).length > 0;

            return (
              <div key={cat.id} className={`tree-level-1-item ${isCatActive ? 'active-level-1' : ''}`}>
                <div
                  className="tree-level-1-header"
                  onClick={() => handleCategoryClick(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleCategoryClick(cat.id)}
                >
                  <span className="tree-level-1-icon">
                    <IconComp size={16} />
                  </span>

                  <span className="tree-level-1-name">{cat.name}</span>

                  <span className="tree-count-badge">{count}</span>

                  {hasSubs && (
                    <span className={`tree-chevron ${isCatExpanded ? 'expanded' : ''}`}>
                      <ChevronDown size={14} />
                    </span>
                  )}

                  {isCatActive && <div className="tree-active-highlight" />}
                </div>

                {/* LEVEL 2 — SUB CATALOG */}
                {hasSubs && isCatExpanded && (
                  <div className="tree-level-2-container">
                    {cat.subCategories.map(sub => {
                      const isSubActive = selectedCat === cat.id && selectedSubCat === sub.id && !selectedType;
                      const isSubExpanded = expandedSubCat === sub.id || Boolean(catalogSearch);
                      const subKey = `${cat.id}-${sub.id}`;
                      const subCount = countsMap.level2[subKey] ?? 0;
                      const hasItems = (sub.items || []).length > 0;

                      return (
                        <div key={sub.id} className={`tree-level-2-item ${isSubActive ? 'active-level-2' : ''}`}>
                          <div
                            className="tree-level-2-header"
                            onClick={(e) => handleSubCatClick(cat.id, sub.id, e)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && handleSubCatClick(cat.id, sub.id, e)}
                          >
                            <span className="tree-bullet">•</span>
                            <span className="tree-level-2-name">{sub.name}</span>
                            <span className="tree-count-badge subtle">{subCount}</span>
                            {hasItems && (
                              <span className={`tree-chevron-sub ${isSubExpanded ? 'expanded' : ''}`}>
                                <ChevronRight size={12} />
                              </span>
                            )}
                          </div>

                          {/* LEVEL 3 — TYPES / ITEMS */}
                          {hasItems && isSubExpanded && (
                            <div className="tree-level-3-container">
                              {sub.items.map(it => {
                                const isTypeActive = selectedCat === cat.id && selectedSubCat === sub.id && selectedType === it.id;
                                const itKey = `${cat.id}-${sub.id}-${it.id}`;
                                const itCount = countsMap.level3[itKey] ?? 0;

                                return (
                                  <div
                                    key={it.id}
                                    className={`tree-level-3-item ${isTypeActive ? 'active-level-3' : ''}`}
                                    onClick={(e) => handleTypeClick(cat.id, sub.id, it.id, e)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && handleTypeClick(cat.id, sub.id, it.id, e)}
                                  >
                                    <span className="tree-dash">-</span>
                                    <span className="tree-level-3-name">{it.name}</span>
                                    <span className="tree-count-badge micro">{itCount}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Professional Filters Section */}
        <div className="sidebar-filters-group">
          <div className="filters-heading">
            <SlidersHorizontal size={14} className="filters-heading-icon" />
            <span>Refine Results</span>
          </div>

          {/* 1. Price Range Slider */}
          <div className="filter-block">
            <div className="filter-label-row">
              <span className="filter-label">Max Price</span>
              <strong className="filter-value-highlight">₹{Number(maxPrice).toLocaleString('en-IN')}</strong>
            </div>
            <div className="price-slider-wrap">
              <input
                type="range"
                min="1500"
                max="4000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="price-slider-control"
                aria-label="Filter maximum price"
              />
              <div className="price-range-ticks">
                <span>₹1,500</span>
                <span>₹2,750</span>
                <span>₹4,000</span>
              </div>
            </div>
          </div>

          {/* 2. Availability Toggle (In Stock Only) */}
          <div className="filter-block">
            <label className="filter-toggle-label">
              <div className="toggle-switch-wrapper">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="toggle-checkbox"
                />
                <span className="toggle-slider" />
              </div>
              <div className="toggle-text">
                <span className="toggle-title">In Stock Only</span>
                <small className="toggle-sub">Ready for dispatch</small>
              </div>
            </label>
          </div>

          {/* 3. Rating Filter (4★ & up) */}
          <div className="filter-block">
            <div className="filter-label-row">
              <span className="filter-label">Minimum Rating</span>
            </div>
            <div className="rating-options-row">
              <button
                type="button"
                className={`rating-pill-btn ${minRating === 0 ? 'active' : ''}`}
                onClick={() => setMinRating(0)}
              >
                All
              </button>
              <button
                type="button"
                className={`rating-pill-btn ${minRating === 4 ? 'active' : ''}`}
                onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
              >
                <Star size={12} fill="#e8c070" stroke="#e8c070" />
                <span>4★ & up</span>
              </button>
            </div>
          </div>

          {/* Reset Filters Button */}
          <button
            type="button"
            className="sidebar-reset-btn"
            onClick={onResetFilters}
          >
            <RotateCcw size={13} />
            <span>Reset filters</span>
          </button>
        </div>

        {/* Promo Card: "Need help choosing? Talk to an expert" -> opens chat widget */}
        <div className="sidebar-promo-card conic-promo-glow" onClick={onOpenChat}>
          <div className="promo-conic-glow-border" />
          <div className="promo-content">
            <div className="promo-icon-badge">
              <MessageCircle size={17} />
            </div>
            <div className="promo-text-wrap">
              <strong className="promo-title">Need help choosing?</strong>
              <p className="promo-desc">Talk to an expert organizer</p>
              <span className="promo-cta-link">
                Ask HangerHome Assistant →
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
