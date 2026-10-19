import mongoose from 'mongoose';

// -------------------------------------------------------------
// Sub-schemas
// -------------------------------------------------------------
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String, default: '' },
    phone: { type: String, default: '' },
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

// -------------------------------------------------------------
// 1. User Model
// -------------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true, default: '' },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'admin', 'staff'],
      default: 'customer',
      index: true,
    },
    isBlocked: { type: Boolean, default: false },
    city: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    acceptedTerms: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshTokenHash: { type: String, default: '' },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 2. Category Model (3-Level Tree: Catalog -> SubCatalog -> Type)
// -------------------------------------------------------------
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    level: { type: Number, enum: [1, 2, 3], default: 1, index: true }, // 1: Main, 2: Sub, 3: Type
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 3. Product Model
// -------------------------------------------------------------
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sku: { type: String, unique: true, sparse: true, trim: true },
    modelName: { type: String, default: '' },
    productType: { type: String, default: 'hanger' },
    isDemo: { type: Boolean, default: false },
    category: { type: String, required: true, index: true },
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    subCategory: { type: String, default: '' },
    subCategoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    type: { type: String, default: '' },
    typeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: true, default: 0, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    images: [imageSchema],
    video: { type: String, default: '' },
    features: [{ type: String }],
    tags: [{ type: String, index: true }],
    specifications: [{ label: { type: String }, value: { type: String } }],
    dimensions: {
      length: { type: String, default: '' },
      width: { type: String, default: '' },
      height: { type: String, default: '' },
      weight: { type: String, default: '' },
    },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active',
      index: true,
    },
    buyEnabled: { type: Boolean, default: true },
    quoteEnabled: { type: Boolean, default: true },
    installationAvailable: { type: Boolean, default: true },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Compound text index for fast search across catalog
productSchema.index({
  name: 'text',
  shortDescription: 'text',
  description: 'text',
  tags: 'text',
  modelName: 'text',
  sku: 'text',
});

// Sync compareAtPrice and mrp on save
productSchema.pre('save', function (next) {
  if (this.compareAtPrice && !this.mrp) this.mrp = this.compareAtPrice;
  if (this.mrp && !this.compareAtPrice) this.compareAtPrice = this.mrp;
  if (this.mrp > this.price && this.price > 0) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

// -------------------------------------------------------------
// 4. Order Model
// -------------------------------------------------------------
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
    installation: { type: Boolean, default: false },
    installationPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const trackingHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now },
    by: { type: String, default: 'system' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: [orderItemSchema],
    customer: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    address: {
      fullName: { type: String, default: '' },
      phone: { type: String, default: '' },
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    subtotal: { type: Number, default: 0 },
    installationTotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: {
      code: { type: String, default: '' },
      discountAmount: { type: Number, default: 0 },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'razorpay', 'razorpay_demo'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentDetails: {
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'new', 'processing'],
      default: 'placed',
      index: true,
    },
    tracking: [trackingHistorySchema],
    adminNotes: { type: String, default: '' },
    isCancelled: { type: Boolean, default: false },
    refundStatus: { type: String, enum: ['none', 'requested', 'processed', 'rejected'], default: 'none' },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 5. Enquiry Model (alias for Contact)
// -------------------------------------------------------------
const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '', trim: true },
    requirement: { type: String, default: 'General' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'resolved', 'closed', 'New', 'Contacted', 'In Progress', 'Resolved'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, default: '' },
    source: { type: String, default: 'contact-page' },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 6. Booking Model (Service & Installation requests)
// -------------------------------------------------------------
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    type: {
      type: String,
      enum: ['installation', 'service', 'repair', 'custom', 'Hanger Installation', 'Hanger Repair & Fixing', 'Custom Hanger Making', 'Maintenance', 'Site Measurement', 'Shoe Rack Installation'],
      default: 'installation',
    },
    customer: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    product: { type: String, default: '' },
    productRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    message: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    photos: [{ type: String }],
    status: {
      type: String,
      enum: ['new', 'scheduled', 'in-progress', 'assigned', 'completed', 'cancelled', 'contacted'],
      default: 'new',
      index: true,
    },
    assignedTechnician: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    notes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    quoteAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 7. GalleryItem Model
// -------------------------------------------------------------
const galleryItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true },
    src: { type: String, default: '' }, // alias for backward compatibility
    thumbnail: { type: String, default: '' },
    title: { type: String, default: '' },
    category: { type: String, default: 'Hangers', index: true },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

galleryItemSchema.pre('save', function (next) {
  if (this.url && !this.src) this.src = this.url;
  if (this.src && !this.url) this.url = this.src;
  next();
});

// -------------------------------------------------------------
// 8. Review Model
// -------------------------------------------------------------
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    comment: { type: String, default: '' }, // alias
    photos: [{ type: String }],
    verified: { type: Boolean, default: false },
    approved: { type: Boolean, default: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true,
    },
  },
  { timestamps: true }
);

reviewSchema.pre('save', function (next) {
  if (this.body && !this.comment) this.comment = this.body;
  if (this.comment && !this.body) this.body = this.comment;
  if (this.status === 'approved') this.approved = true;
  else if (this.status === 'rejected') this.approved = false;
  next();
});

// -------------------------------------------------------------
// 9. FAQ Model
// -------------------------------------------------------------
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    group: {
      type: String,
      enum: ['contact', 'installation', 'general'],
      default: 'general',
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 10. Testimonial Model
// -------------------------------------------------------------
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    text: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 11. Setting Model (Single Document Pattern)
// -------------------------------------------------------------
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'site_settings' },
    businessName: { type: String, default: 'HangerHome' },
    tagline: { type: String, default: 'Smart Space. Smarter Living.' },
    phone: { type: String, default: '+91 98765 43210' },
    whatsapp: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'support@hangerhome.com' },
    address: { type: String, default: 'HangerHome Studio, Bangalore, Karnataka, India' },
    serviceArea: { type: String, default: 'Bangalore, Mumbai, Delhi-NCR, Hyderabad, Chennai, Pune' },
    workingHours: { type: String, default: 'Mon - Sat: 9:00 AM - 7:00 PM' },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/hangerhome' },
      facebook: { type: String, default: 'https://facebook.com/hangerhome' },
      youtube: { type: String, default: 'https://youtube.com/@hangerhome' },
      twitter: { type: String, default: '' },
    },
    shippingRules: {
      flatRate: { type: Number, default: 99 },
      freeShippingThreshold: { type: Number, default: 3000 },
    },
    taxPercent: { type: Number, default: 0 },
    paymentMethods: {
      cod: { type: Boolean, default: true },
      razorpay: { type: Boolean, default: true },
    },
    announcementText: {
      type: String,
      default: 'Complimentary site measurement and professional installation available across major cities.',
    },
    stats: {
      homes: { type: Number, default: 1000 },
      years: { type: Number, default: 5 },
      products: { type: Number, default: 20 },
      satisfaction: { type: Number, default: 99 },
    },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 12. Coupon Model
// -------------------------------------------------------------
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: { type: Number, required: true, min: 0 },
    minimumOrder: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 }, // alias
    expiry: { type: Date, default: null },
    expiresAt: { type: Date, default: null }, // alias
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    active: { type: Boolean, default: true }, // alias
  },
  { timestamps: true }
);

couponSchema.pre('save', function (next) {
  if (this.minimumOrder && !this.minOrder) this.minOrder = this.minimumOrder;
  if (this.minOrder && !this.minimumOrder) this.minimumOrder = this.minOrder;
  if (this.expiry && !this.expiresAt) this.expiresAt = this.expiry;
  if (this.expiresAt && !this.expiry) this.expiry = this.expiresAt;
  if (this.isActive !== undefined) this.active = this.isActive;
  next();
});

// -------------------------------------------------------------
// 13. Subscriber Model
// -------------------------------------------------------------
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active', index: true },
    source: { type: String, default: 'footer' },
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// 14. AuditLog Model
// -------------------------------------------------------------
const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'Admin' },
    userRole: { type: String, default: 'admin' },
    action: { type: String, required: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, default: '' },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// -------------------------------------------------------------
// Legacy & Backward Compatibility Schemas
// -------------------------------------------------------------
const contentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true },
    value: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const quoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: { name: String, email: String, phone: String },
    service: String,
    message: String,
    dimensions: String,
    photos: [String],
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'accepted', 'rejected', 'completed'],
      default: 'new',
    },
    quoteAmount: Number,
    validUntil: String,
  },
  { timestamps: true }
);

// -------------------------------------------------------------
// Exports
// -------------------------------------------------------------
export const User = mongoose.model('User', userSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Product = mongoose.model('Product', productSchema);
export const Order = mongoose.model('Order', orderSchema);
export const Service = mongoose.model('Service', bookingSchema); // Service is now backed by bookingSchema
export const Booking = mongoose.model('Booking', bookingSchema); // Alias
export const Contact = mongoose.model('Contact', enquirySchema); // Contact is now backed by enquirySchema
export const Enquiry = mongoose.model('Enquiry', enquirySchema); // Alias
export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export const Review = mongoose.model('Review', reviewSchema);
export const Faq = mongoose.model('Faq', faqSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export const Setting = mongoose.model('Setting', settingSchema);
export const Coupon = mongoose.model('Coupon', couponSchema);
export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export const Content = mongoose.model('Content', contentSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const Quote = mongoose.model('Quote', quoteSchema);
