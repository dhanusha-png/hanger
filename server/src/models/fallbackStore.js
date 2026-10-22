import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const hashSync = bcrypt.hashSync;
import { demoProducts } from '../demo-products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'hanger_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function newId() {
  return new mongoose.Types.ObjectId().toString();
}

function initialSeed() {
  const adminPasswordHash = hashSync('Admin@123', 10);
  const now = new Date().toISOString();

  // Categories
  const categories = [
    { _id: newId(), name: 'Ceiling Hangers', slug: 'ceiling-hangers', level: 1, icon: 'CeilingPulleyIcon', order: 1, description: 'Overhead pulley and retractable drying systems for balconies and utility ceilings.', isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), name: 'Wall Hangers', slug: 'wall-hangers', level: 1, icon: 'WallHangerIcon', order: 2, description: 'Space-saving accordion and foldable wall-mounted drying racks.', isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), name: 'Shoe Racks', slug: 'shoe-racks', level: 1, icon: 'ShoeIcon', order: 3, description: 'Multi-tier organizers, slim entryway cabinets, and floor-standing racks.', isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), name: 'Storage Solutions', slug: 'storage-solutions', level: 1, icon: 'StorageBoxIcon', order: 4, description: 'Modular organizers, valets, coat trees, and space-saving accessories.', isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), name: 'Custom Solutions', slug: 'custom-solutions', level: 1, icon: 'RulerTriangleIcon', order: 5, description: 'Tailored dimensions and custom installations engineered for your home.', isActive: true, createdAt: now, updatedAt: now },
  ];

  // Products
  const products = demoProducts.map((p, idx) => ({
    _id: newId(),
    ...p,
    price: Number(p.price || 0),
    compareAtPrice: Number(p.compareAtPrice || 0),
    mrp: Number(p.mrp || p.compareAtPrice || p.price || 0),
    discount: Number(p.discount || 0),
    stock: Number(p.stock !== undefined ? p.stock : 15),
    lowStockThreshold: 5,
    order: idx + 1,
    isActive: true,
    status: 'active',
    buyEnabled: true,
    quoteEnabled: true,
    installationAvailable: true,
    createdAt: now,
    updatedAt: now,
  }));

  // Users
  const users = [
    {
      _id: newId(),
      name: 'Super Admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+919876543210',
      city: 'Mumbai',
      pincode: '400001',
      acceptedTerms: true,
      isBlocked: false,
      addresses: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: newId(),
      name: 'Operations Staff',
      email: 'staff@example.com',
      passwordHash: adminPasswordHash,
      role: 'staff',
      phone: '+919876543211',
      city: 'Bangalore',
      pincode: '560001',
      acceptedTerms: true,
      isBlocked: false,
      addresses: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: newId(),
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      passwordHash: adminPasswordHash,
      role: 'customer',
      phone: '+919876543220',
      city: 'Bangalore',
      pincode: '560034',
      acceptedTerms: true,
      isBlocked: false,
      addresses: [{ _id: newId(), fullName: 'Rahul Verma', phone: '+919876543220', line1: 'Flat 402, Green Glen', city: 'Bangalore', state: 'Karnataka', pincode: '560034', country: 'India', isDefault: true }],
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: newId(),
      name: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      passwordHash: adminPasswordHash,
      role: 'customer',
      phone: '+919876543221',
      city: 'Mumbai',
      pincode: '400050',
      acceptedTerms: true,
      isBlocked: false,
      addresses: [{ _id: newId(), fullName: 'Sneha Patel', phone: '+919876543221', line1: '14 Palm Beach Rd', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', country: 'India', isDefault: true }],
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Orders
  const orders = [
    {
      _id: newId(),
      orderNumber: 'HH-2026-000101',
      user: users[2]._id,
      customer: { name: 'Rahul Verma', email: 'rahul.verma@example.com', phone: '+919876543220' },
      items: [
        { product: products[0]._id, name: products[0].name, image: products[0].images?.[0]?.url || '', price: products[0].price, qty: 1, installation: true, installationPrice: 499 }
      ],
      address: { fullName: 'Rahul Verma', phone: '+919876543220', line1: 'Flat 402, Green Glen', city: 'Bangalore', state: 'Karnataka', pincode: '560034', country: 'India' },
      subtotal: products[0].price,
      installationTotal: 499,
      shipping: 0,
      discount: 0,
      total: products[0].price + 499,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'confirmed',
      tracking: [{ status: 'confirmed', note: 'Order confirmed by customer', at: now, by: 'system' }],
      adminNotes: 'Customer requested afternoon slot',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: now,
    },
    {
      _id: newId(),
      orderNumber: 'HH-2026-000102',
      user: users[3]._id,
      customer: { name: 'Sneha Patel', email: 'sneha.patel@example.com', phone: '+919876543221' },
      items: [
        { product: products[1]._id, name: products[1].name, image: products[1].images?.[0]?.url || '', price: products[1].price, qty: 1, installation: false, installationPrice: 0 }
      ],
      address: { fullName: 'Sneha Patel', phone: '+919876543221', line1: '14 Palm Beach Rd', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', country: 'India' },
      subtotal: products[1].price,
      installationTotal: 0,
      shipping: 0,
      discount: 200,
      total: products[1].price - 200,
      paymentMethod: 'razorpay_demo',
      paymentStatus: 'paid',
      status: 'delivered',
      tracking: [
        { status: 'placed', note: 'Order placed', at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), by: 'system' },
        { status: 'delivered', note: 'Delivered safely', at: now, by: 'admin' }
      ],
      adminNotes: '',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: now,
    }
  ];

  // Enquiries
  const enquiries = [
    {
      _id: newId(),
      name: 'Aditya Roy',
      email: 'aditya.roy@example.com',
      phone: '+919876500112',
      requirement: 'Ceiling Cloth Hangers',
      message: 'Looking for 6-rod pulley ceiling hanger for 8ft balcony ceiling in Bangalore.',
      status: 'new',
      adminNotes: '',
      source: 'contact-page',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: newId(),
      name: 'Meera Nambiar',
      email: 'meera.nambiar@example.com',
      phone: '+919876500114',
      requirement: 'Shoe Rack Installation',
      message: 'Need 4-tier shoe organizer with anti-tip anchoring in Koramangala.',
      status: 'contacted',
      adminNotes: 'Spoke with customer, sent catalog photos',
      source: 'contact-page',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: now,
    }
  ];

  // Bookings / Services
  const bookings = [
    {
      _id: newId(),
      type: 'Hanger Installation',
      customer: { name: 'Vikram Joshi', email: 'vikram.j@example.com', phone: '+919876511223' },
      address: { line1: 'Flat 5B, Skyline Towers, Bellandur', city: 'Bangalore', state: 'Karnataka', pincode: '560103' },
      preferredDate: '2026-10-25',
      preferredTime: '10:00 AM - 1:00 PM',
      status: 'new',
      assignedTechnician: { name: 'Kiran Kumar', phone: '+919876509988' },
      quoteAmount: 499,
      message: 'Balcony installation into concrete ceiling.',
      adminNotes: '',
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Gallery
  const galleryItems = [
    { _id: newId(), url: '/media/hanger-1.jpg', src: '/media/hanger-1.jpg', thumbnail: '/media/hanger-1.jpg', title: 'Ceiling Hanger High-Rise Balcony', category: 'Hangers', type: 'image', order: 1, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), url: '/media/hanger-2.jpg', src: '/media/hanger-2.jpg', thumbnail: '/media/hanger-2.jpg', title: 'Corridor Overhead Clothes Rack', category: 'Hangers', type: 'image', order: 2, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), url: '/media/hanger-3.jpg', src: '/media/hanger-3.jpg', thumbnail: '/media/hanger-3.jpg', title: 'Stainless Steel Pulley Rod System', category: 'Hangers', type: 'image', order: 3, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), url: '/media/hanger-4.jpg', src: '/media/hanger-4.jpg', thumbnail: '/media/hanger-4.jpg', title: 'Wall-Mounted Accordion Scissor Dryer', category: 'Hangers', type: 'image', order: 4, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), url: '/media/hanger-5.jpg', src: '/media/hanger-5.jpg', thumbnail: '/media/hanger-5.jpg', title: 'Compact Multi-Tier Wooden Shoe Rack', category: 'Shoe Racks', type: 'image', order: 5, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), url: '/media/hanger-6.jpg', src: '/media/hanger-6.jpg', thumbnail: '/media/hanger-6.jpg', title: 'Integrated Laundry & Valet Storage', category: 'Projects', type: 'image', order: 6, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), url: '/media/hanger-demo.mp4', src: '/media/hanger-demo.mp4', thumbnail: '/media/hanger-1.jpg', title: 'Ceiling Pulley Demonstration Video', category: 'Hangers', type: 'video', order: 7, isActive: true, createdAt: now, updatedAt: now },
  ];

  // Banners
  const banners = [
    {
      _id: newId(),
      title: 'Turn Every Space Into Something Better.',
      subtitle: 'Smart Space • Premium Living',
      description: 'Premium ceiling hangers, shoe racks and home storage solutions with professional installation.',
      image: '/media/hanger-1.jpg',
      link: '/products',
      buttonText: 'Explore Solutions',
      badge: 'TOP FEATURED',
      placement: 'home_hero',
      order: 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Reviews
  const reviews = [
    {
      _id: newId(),
      name: 'Suresh Menon',
      avatar: '',
      rating: 5,
      title: 'Flawless Installation & Solid Build',
      body: 'Installed the 6-rod ceiling hanger in our balcony. Frees up so much floor space. Very happy with the service.',
      comment: 'Installed the 6-rod ceiling hanger in our balcony. Frees up so much floor space. Very happy with the service.',
      verified: true,
      approved: true,
      status: 'approved',
      createdAt: now,
      updatedAt: now,
    }
  ];

  // FAQs
  const faqs = [
    { _id: newId(), group: 'installation', question: 'Do you provide professional installation with product purchases?', answer: 'Yes, we provide certified professional installation for all ceiling-mounted, wall-mounted, and balcony clothes drying systems.', order: 1, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), group: 'installation', question: 'Do you provide on-site measurements before installation?', answer: 'Yes. Our technician visits your home to inspect the ceiling or wall structure and check clearance heights before fitting.', order: 2, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), group: 'contact', question: 'How quickly does the HangerHome team respond to enquiries?', answer: 'Our customer support team typically reviews and responds to general enquiries and service requests within 2 to 4 business hours.', order: 1, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), group: 'general', question: 'What payment options are supported?', answer: 'We support Cash on Delivery (COD) as well as secure online payments via Razorpay (UPI, Netbanking, Credit & Debit Cards).', order: 1, isActive: true, createdAt: now, updatedAt: now },
  ];

  // Testimonials
  const testimonials = [
    { _id: newId(), name: 'Ananya Sharma', location: 'Bangalore · Whitefield', text: 'The ceiling drying hanger completely transformed our balcony. The pulley system is effortless to operate and frees up the entire floor.', rating: 5, image: '/media/hanger-1.jpg', order: 1, isActive: true, createdAt: now, updatedAt: now },
    { _id: newId(), name: 'Vikram Mehta', location: 'Mumbai · Powai', text: 'Sturdy stainless steel construction and neat wall mounting. Highly recommend HangerHome.', rating: 5, image: '/media/hanger-2.jpg', order: 2, isActive: true, createdAt: now, updatedAt: now },
  ];

  // Settings
  const settings = [
    {
      _id: newId(),
      key: 'site_settings',
      businessName: 'HangerHome',
      tagline: 'Designed for your space. Built for everyday living.',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'support@hangerhome.com',
      address: 'HangerHome Studio, Bangalore, Karnataka, India',
      serviceArea: 'Bangalore, Mumbai, Delhi-NCR, Hyderabad, Chennai, Pune',
      workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      socialLinks: {
        instagram: 'https://instagram.com/hangerhome',
        facebook: 'https://facebook.com/hangerhome',
        youtube: 'https://youtube.com/@hangerhome',
        twitter: '',
      },
      shippingRules: { flatRate: 99, freeShippingThreshold: 3000 },
      taxPercent: 0,
      paymentMethods: { cod: true, razorpay: true },
      announcementText: 'Complimentary site measurement and professional installation available across major cities.',
      stats: { homes: 1000, years: 5, products: 20, satisfaction: 99 },
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Coupons
  const coupons = [
    {
      _id: newId(),
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      minimumOrder: 1500,
      minOrder: 1500,
      usageLimit: 200,
      usedCount: 14,
      isActive: true,
      active: true,
      createdAt: now,
      updatedAt: now,
    }
  ];

  // Subscribers
  const subscribers = [
    { _id: newId(), email: 'client@example.com', status: 'active', source: 'footer', createdAt: now, updatedAt: now }
  ];

  // Audit Logs
  const auditLogs = [
    {
      _id: newId(),
      userName: 'Super Admin',
      userRole: 'admin',
      action: 'system_initialize',
      entity: 'System',
      entityId: 'init',
      details: { message: 'Database initialized with demo catalog and administrative roles' },
      ip: '127.0.0.1',
      createdAt: now,
    }
  ];

  return {
    User: users,
    Category: categories,
    Product: products,
    Order: orders,
    Enquiry: enquiries,
    Contact: enquiries,
    Booking: bookings,
    Service: bookings,
    GalleryItem: galleryItems,
    Review: reviews,
    Faq: faqs,
    Testimonial: testimonials,
    Setting: settings,
    Coupon: coupons,
    Subscriber: subscribers,
    AuditLog: auditLogs,
    Content: [],
    Notification: [],
    Quote: bookings,
    Banner: banners,
  };
}

class FallbackStore {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = initialSeed();
        this.persist();
      }
    } catch (e) {
      console.warn('[FallbackStore] Failed to load JSON store, re-seeding:', e.message);
      this.data = initialSeed();
      this.persist();
    }
  }

  persist() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[FallbackStore] Persist error:', e.message);
    }
  }

  getTable(modelName) {
    if (!this.data[modelName]) {
      this.data[modelName] = [];
    }
    return this.data[modelName];
  }
}

export const fallbackStore = new FallbackStore();

/**
 * Filter evaluation helper
 */
function matchesQuery(doc, filter = {}) {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, val] of Object.entries(filter)) {
    if (key === '$or') {
      if (!Array.isArray(val) || !val.length) continue;
      const anyMatch = val.some((subQuery) => matchesQuery(doc, subQuery));
      if (!anyMatch) return false;
      continue;
    }
    if (key === '$and') {
      if (!Array.isArray(val) || !val.length) continue;
      const allMatch = val.every((subQuery) => matchesQuery(doc, subQuery));
      if (!allMatch) return false;
      continue;
    }

    const docVal = doc[key];

    // Filter value is an object (operators like $in, $ne, $regex, $gte, etc.)
    if (val && typeof val === 'object' && !(val instanceof RegExp)) {
      if (val.$in) {
        if (!val.$in.includes(docVal)) return false;
        continue;
      }
      if (val.$ne !== undefined) {
        if (docVal === val.$ne) return false;
        continue;
      }
      if (val.$gte !== undefined) {
        if (new Date(docVal).getTime() < new Date(val.$gte).getTime()) return false;
        continue;
      }
      if (val.$lte !== undefined) {
        if (Number(docVal) > Number(val.$lte)) return false;
        continue;
      }
      if (val.$regex) {
        const flags = val.$options || '';
        const re = new RegExp(val.$regex, flags);
        if (!re.test(String(docVal || ''))) return false;
        continue;
      }
    }

    // Direct RegExp
    if (val instanceof RegExp) {
      if (!val.test(String(docVal || ''))) return false;
      continue;
    }

    // Simple comparison
    if (String(docVal || '') !== String(val || '')) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a smart document instance with .toObject() and .save()
 */
function wrapDoc(rawDoc, modelName, store) {
  if (!rawDoc) return null;
  const doc = { ...rawDoc };

  Object.defineProperty(doc, 'toObject', {
    enumerable: false,
    value: function () {
      return { ...this };
    },
  });

  Object.defineProperty(doc, 'save', {
    enumerable: false,
    value: async function () {
      this.updatedAt = new Date().toISOString();
      const table = store.getTable(modelName);
      const idx = table.findIndex((d) => String(d._id) === String(this._id));
      if (idx >= 0) {
        table[idx] = { ...this };
      } else {
        table.push({ ...this });
      }
      store.persist();
      return this;
    },
  });

  return doc;
}

/**
 * Creates a chainable query object mimicking Mongoose Query
 */
class FallbackQuery {
  constructor(modelName, filter, isFindOne = false) {
    this.modelName = modelName;
    this.filter = filter;
    this.isFindOne = isFindOne;
    this._sort = null;
    this._skip = 0;
    this._limit = 0;
    this._select = null;
    this._populate = [];
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  skip(n) {
    this._skip = Math.max(0, n || 0);
    return this;
  }

  limit(n) {
    this._limit = Math.max(0, n || 0);
    return this;
  }

  select(fields) {
    this._select = fields;
    return this;
  }

  populate(field, select) {
    this._populate.push({ field, select });
    return this;
  }

  async execute() {
    const table = fallbackStore.getTable(this.modelName);
    let results = table.filter((d) => matchesQuery(d, this.filter));

    if (this._sort) {
      results.sort((a, b) => {
        for (const [k, dir] of Object.entries(this._sort)) {
          const valA = a[k] !== undefined ? a[k] : '';
          const valB = b[k] !== undefined ? b[k] : '';
          if (valA < valB) return dir === -1 ? 1 : -1;
          if (valA > valB) return dir === -1 ? -1 : 1;
        }
        return 0;
      });
    }

    if (this._skip > 0) {
      results = results.slice(this._skip);
    }

    if (this._limit > 0) {
      results = results.slice(0, this._limit);
    }

    // Populate user if needed
    for (const pop of this._populate) {
      if (pop.field === 'user') {
        const usersTable = fallbackStore.getTable('User');
        results = results.map((d) => {
          if (d.user) {
            const u = usersTable.find((user) => String(user._id) === String(d.user));
            if (u) {
              return { ...d, user: { _id: u._id, name: u.name, email: u.email } };
            }
          }
          return d;
        });
      }
      if (pop.field === 'product') {
        const prodTable = fallbackStore.getTable('Product');
        results = results.map((d) => {
          if (d.product) {
            const p = prodTable.find((prod) => String(prod._id) === String(d.product));
            if (p) {
              return { ...d, product: { _id: p._id, name: p.name, price: p.price, images: p.images } };
            }
          }
          return d;
        });
      }
    }

    // Strip passwordHash if requested
    if (this._select && typeof this._select === 'string' && this._select.includes('-passwordHash')) {
      results = results.map((d) => {
        const copy = { ...d };
        delete copy.passwordHash;
        return copy;
      });
    }

    if (this.isFindOne) {
      return results.length ? wrapDoc(results[0], this.modelName, fallbackStore) : null;
    }

    return results.map((r) => wrapDoc(r, this.modelName, fallbackStore));
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

/**
 * Creates a Model Adapter wrapping a table with Mongoose methods
 */
export function createModelAdapter(modelName, mongooseModel) {
  const adapter = {
    find(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.find(filter);
      }
      return new FallbackQuery(modelName, filter, false);
    },

    findOne(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.findOne(filter);
      }
      return new FallbackQuery(modelName, filter, true);
    },

    findById(id) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.findById(id);
      }
      return new FallbackQuery(modelName, { _id: String(id) }, true);
    },

    async create(docData) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.create(docData);
      }
      const table = fallbackStore.getTable(modelName);
      const now = new Date().toISOString();
      const newDoc = {
        _id: newId(),
        ...docData,
        createdAt: docData.createdAt || now,
        updatedAt: now,
      };

      // Model hooks emulation
      if (modelName === 'Product') {
        if (newDoc.compareAtPrice && !newDoc.mrp) newDoc.mrp = newDoc.compareAtPrice;
        if (newDoc.mrp && !newDoc.compareAtPrice) newDoc.compareAtPrice = newDoc.mrp;
        if (newDoc.mrp > newDoc.price && newDoc.price > 0) {
          newDoc.discount = Math.round(((newDoc.mrp - newDoc.price) / newDoc.mrp) * 100);
        }
      }
      if (modelName === 'GalleryItem') {
        if (newDoc.url && !newDoc.src) newDoc.src = newDoc.url;
        if (newDoc.src && !newDoc.url) newDoc.url = newDoc.src;
      }
      if (modelName === 'Coupon') {
        if (newDoc.minimumOrder && !newDoc.minOrder) newDoc.minOrder = newDoc.minimumOrder;
        if (newDoc.minOrder && !newDoc.minimumOrder) newDoc.minimumOrder = newDoc.minOrder;
        if (newDoc.expiry && !newDoc.expiresAt) newDoc.expiresAt = newDoc.expiry;
      }

      table.unshift(newDoc);
      fallbackStore.persist();
      return wrapDoc(newDoc, modelName, fallbackStore);
    },

    async findByIdAndUpdate(id, update = {}, options = {}) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.findByIdAndUpdate(id, update, options);
      }
      const table = fallbackStore.getTable(modelName);
      const idx = table.findIndex((d) => String(d._id) === String(id));
      if (idx < 0) return null;

      const existing = table[idx];
      const updated = { ...existing };

      for (const [k, v] of Object.entries(update)) {
        if (k === '$set') {
          Object.assign(updated, v);
        } else if (k === '$inc') {
          for (const [incK, incV] of Object.entries(v)) {
            updated[incK] = (Number(updated[incK]) || 0) + Number(incV);
          }
        } else if (k === '$push') {
          for (const [pushK, pushV] of Object.entries(v)) {
            if (!Array.isArray(updated[pushK])) updated[pushK] = [];
            updated[pushK].push(pushV);
          }
        } else {
          updated[k] = v;
        }
      }

      updated.updatedAt = new Date().toISOString();

      if (modelName === 'Product') {
        if (updated.compareAtPrice && !updated.mrp) updated.mrp = updated.compareAtPrice;
        if (updated.mrp && !updated.compareAtPrice) updated.compareAtPrice = updated.mrp;
        if (updated.mrp > updated.price && updated.price > 0) {
          updated.discount = Math.round(((updated.mrp - updated.price) / updated.mrp) * 100);
        }
      }

      table[idx] = updated;
      fallbackStore.persist();
      return wrapDoc(updated, modelName, fallbackStore);
    },

    async findByIdAndDelete(id) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.findByIdAndDelete(id);
      }
      const table = fallbackStore.getTable(modelName);
      const idx = table.findIndex((d) => String(d._id) === String(id));
      if (idx < 0) return null;
      const [removed] = table.splice(idx, 1);
      fallbackStore.persist();
      return wrapDoc(removed, modelName, fallbackStore);
    },

    async deleteMany(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.deleteMany(filter);
      }
      const table = fallbackStore.getTable(modelName);
      const initialLen = table.length;
      fallbackStore.data[modelName] = table.filter((d) => !matchesQuery(d, filter));
      fallbackStore.persist();
      return { deletedCount: initialLen - fallbackStore.data[modelName].length };
    },

    async countDocuments(filter = {}) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.countDocuments(filter);
      }
      const table = fallbackStore.getTable(modelName);
      return table.filter((d) => matchesQuery(d, filter)).length;
    },

    async aggregate(pipeline = []) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel.aggregate(pipeline);
      }

      const table = fallbackStore.getTable(modelName);
      let results = [...table];

      for (const stage of pipeline) {
        if (stage.$match) {
          results = results.filter((d) => matchesQuery(d, stage.$match));
        } else if (stage.$group) {
          const groupKey = stage.$group._id;
          const groups = new Map();

          for (const item of results) {
            let key = 'null';
            if (groupKey && typeof groupKey === 'string' && groupKey.startsWith('$')) {
              key = String(item[groupKey.slice(1)] || '');
            }

            if (!groups.has(key)) {
              groups.set(key, { _id: key === 'null' ? null : key, count: 0, total: 0, revenue: 0 });
            }
            const g = groups.get(key);
            g.count += 1;
            if (stage.$group.total && stage.$group.total.$sum) {
              const field = stage.$group.total.$sum.slice(1);
              g.total += Number(item[field] || 0);
            }
            if (stage.$group.revenue && stage.$group.revenue.$sum) {
              const field = stage.$group.revenue.$sum.slice(1);
              g.revenue += Number(item[field] || 0);
            }
          }
          results = Array.from(groups.values());
        } else if (stage.$sort) {
          results.sort((a, b) => {
            for (const [k, dir] of Object.entries(stage.$sort)) {
              if (a[k] < b[k]) return dir === -1 ? 1 : -1;
              if (a[k] > b[k]) return dir === -1 ? -1 : 1;
            }
            return 0;
          });
        }
      }

      return results;
    },
  };

  return adapter;
}
