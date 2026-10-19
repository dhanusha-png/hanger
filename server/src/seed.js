import 'dotenv/config';
import mongoose from 'mongoose';
import {
  User,
  Category,
  Product,
  Setting,
  Content,
  Faq,
  Testimonial,
  GalleryItem,
  Coupon,
} from './models/index.js';
import { hash } from './utils/auth.js';
import { demoProducts } from './demo-products.js';

// Default 3-Level Categories Blueprint
const initialCategories = [
  // Level 1: Main Catalog Categories
  { name: 'Ceiling Hangers', slug: 'ceiling-hangers', level: 1, icon: 'CeilingPulleyIcon', order: 1, description: 'Overhead pulley and retractable drying systems for balconies and utility ceilings.' },
  { name: 'Wall Hangers', slug: 'wall-hangers', level: 1, icon: 'WallHangerIcon', order: 2, description: 'Space-saving accordion and foldable wall-mounted drying racks.' },
  { name: 'Shoe Racks', slug: 'shoe-racks', level: 1, icon: 'ShoeIcon', order: 3, description: 'Multi-tier organizers, slim entryway cabinets, and floor-standing racks.' },
  { name: 'Storage Solutions', slug: 'storage-solutions', level: 1, icon: 'StorageBoxIcon', order: 4, description: 'Modular organizers, valets, coat trees, and space-saving accessories.' },
  { name: 'Custom Solutions', slug: 'custom-solutions', level: 1, icon: 'RulerTriangleIcon', order: 5, description: 'Tailored dimensions and custom installations engineered for your home.' },

  // Level 2: Sub-categories
  { name: 'Retractable', slug: 'retractable', level: 2, parentSlug: 'ceiling-hangers', order: 1 },
  { name: 'Pulley Type', slug: 'pulley-type', level: 2, parentSlug: 'ceiling-hangers', order: 2 },
  { name: 'Stainless Steel Systems', slug: 'stainless-steel', level: 2, parentSlug: 'ceiling-hangers', order: 3 },
  { name: 'Balcony Systems', slug: 'balcony-systems', level: 2, parentSlug: 'ceiling-hangers', order: 4 },
  { name: 'Foldable Racks', slug: 'foldable', level: 2, parentSlug: 'wall-hangers', order: 1 },
  { name: 'Fixed Wall Units', slug: 'fixed', level: 2, parentSlug: 'wall-hangers', order: 2 },
  { name: 'Cloth Drying Extensions', slug: 'cloth-drying', level: 2, parentSlug: 'wall-hangers', order: 3 },
  { name: 'Wall Mounted Shoes', slug: 'wall-mounted-shoes', level: 2, parentSlug: 'shoe-racks', order: 1 },
  { name: 'Floor Standing Racks', slug: 'floor-standing', level: 2, parentSlug: 'shoe-racks', order: 2 },
  { name: 'Entryway Cabinets', slug: 'cabinets', level: 2, parentSlug: 'shoe-racks', order: 3 },
  { name: 'Storage Boxes & Baskets', slug: 'boxes-baskets', level: 2, parentSlug: 'storage-solutions', order: 1 },
  { name: 'Shelves & Alcoves', slug: 'shelves', level: 2, parentSlug: 'storage-solutions', order: 2 },
  { name: 'Hooks & Accessories', slug: 'hooks-accessories', level: 2, parentSlug: 'storage-solutions', order: 3 },

  // Level 3: Types
  { name: '4-Rod System', slug: '4-rod', level: 3, parentSlug: 'retractable', order: 1 },
  { name: '6-Rod System', slug: '6-rod', level: 3, parentSlug: 'retractable', order: 2 },
  { name: 'Motorised System', slug: 'motorised', level: 3, parentSlug: 'retractable', order: 3 },
  { name: 'Heavy-Duty Pulley', slug: 'heavy-duty', level: 3, parentSlug: 'pulley-type', order: 1 },
  { name: 'Dual-Pulley Balcony', slug: 'dual-pulley', level: 3, parentSlug: 'pulley-type', order: 2 },
  { name: 'Compact Pulley', slug: 'compact-pulley', level: 3, parentSlug: 'pulley-type', order: 3 },
  { name: 'Marine-Grade 304', slug: 'marine-grade', level: 3, parentSlug: 'stainless-steel', order: 1 },
  { name: 'Chrome Finish', slug: 'chrome-finish', level: 3, parentSlug: 'stainless-steel', order: 2 },
  { name: 'Compact Fold', slug: 'compact-fold', level: 3, parentSlug: 'foldable', order: 1 },
  { name: 'Accordion Wall Scissor', slug: 'accordion', level: 3, parentSlug: 'foldable', order: 2 },
  { name: '3-Tier Organizer', slug: '3-tier-wall', level: 3, parentSlug: 'floor-standing', order: 1 },
  { name: '4-Tier Deluxe Organizer', slug: '4-tier-wall', level: 3, parentSlug: 'floor-standing', order: 2 },
  { name: 'Slim Entryway Unit', slug: 'slim-entryway', level: 3, parentSlug: 'cabinets', order: 1 },
];

// Initial FAQs
const initialFaqs = [
  {
    group: 'installation',
    question: 'Do you provide professional installation with product purchases?',
    answer: 'Yes, we provide certified professional installation for all ceiling-mounted, wall-mounted, and balcony clothes drying systems as well as multi-tier shoe racks to guarantee safety, precision, and longevity.',
    order: 1,
  },
  {
    group: 'installation',
    question: 'Do you provide on-site measurements before installation?',
    answer: 'Yes. Our technician visits your home to inspect the ceiling or wall structure, measure dimensions, check clearance heights, and recommend the ideal rod length and spacing before fitting.',
    order: 2,
  },
  {
    group: 'installation',
    question: 'Can you repair or service existing hanger systems?',
    answer: 'Yes! We repair and service all kinds of existing ceiling and wall hangers, including replacing frayed nylon or wire ropes, replacing stuck or squeaky pulleys, realigning rods, and tension balancing.',
    order: 3,
  },
  {
    group: 'installation',
    question: 'What types of ceiling materials can you install into?',
    answer: 'We securely anchor into concrete slabs, RCC ceilings, and reinforced balconies using heavy-duty industrial anchor fasteners. For false ceilings, we install custom extension rods securely anchored to the true concrete ceiling above.',
    order: 4,
  },
  {
    group: 'installation',
    question: 'Can you install multi-tier shoe racks and storage organizers?',
    answer: 'Yes, our team provides full assembly and anti-tip wall anchoring for entryway shoe racks, heavy-duty organizers, and custom shelving to prevent tipping and keep your home tidy.',
    order: 5,
  },
  {
    group: 'installation',
    question: 'What is covered under the Annual Service Plan?',
    answer: 'Our Annual Service Plan includes scheduled periodic visits, complete safety checks, pulley lubrication, cord tension adjustment, free cord replacements, and priority support for any unexpected issues.',
    order: 6,
  },
  {
    group: 'contact',
    question: 'How quickly does the HangerHome team respond to enquiries?',
    answer: 'Our customer support team typically reviews and responds to general enquiries and service requests within 2 to 4 business hours.',
    order: 1,
  },
  {
    group: 'contact',
    question: 'Can I request an on-site consultation before ordering?',
    answer: 'Yes. If you are uncertain about ceiling suitability, balcony height, or wall strength, you can select "Site Measurement Request" and our technician will schedule a visit.',
    order: 2,
  },
  {
    group: 'contact',
    question: 'Do you provide services on weekends?',
    answer: 'Yes, we schedule installation and repair appointments on Saturdays and Sundays based on technician availability and slot booking.',
    order: 3,
  },
  {
    group: 'general',
    question: 'What payment options are supported?',
    answer: 'We support Cash on Delivery (COD) as well as secure online payments via Razorpay (UPI, Netbanking, Credit & Debit Cards).',
    order: 1,
  },
];

// Initial Testimonials
const initialTestimonials = [
  {
    name: 'Ananya Sharma',
    location: 'Bangalore · Whitefield',
    text: 'The ceiling drying hanger completely transformed our balcony. The pulley system is effortless to operate and frees up the entire floor. The installation team was punctual and tidy.',
    rating: 5,
    image: '/media/hanger-1.jpg',
    order: 1,
  },
  {
    name: 'Vikram Mehta',
    location: 'Mumbai · Powai',
    text: 'Sturdy stainless steel construction and neat wall mounting. It has survived heavy monsoon seasons without a spot of rust. Highly recommend HangerHome.',
    rating: 5,
    image: '/media/hanger-2.jpg',
    order: 2,
  },
  {
    name: 'Priya Iyer',
    location: 'Chennai · Adyar',
    text: 'The 4-tier shoe organizer fits our narrow entryway perfectly. It holds all our family footwear while looking like a designer piece of furniture.',
    rating: 5,
    image: '/media/hanger-5.jpg',
    order: 3,
  },
];

// Initial Gallery Items
const initialGalleryItems = [
  { url: '/media/hanger-1.jpg', title: 'Ceiling Hanger High-Rise Balcony', category: 'Hangers', type: 'image', order: 1 },
  { url: '/media/hanger-2.jpg', title: 'Corridor Overhead Clothes Rack', category: 'Hangers', type: 'image', order: 2 },
  { url: '/media/hanger-3.jpg', title: 'Stainless Steel Pulley Rod System', category: 'Hangers', type: 'image', order: 3 },
  { url: '/media/hanger-4.jpg', title: 'Wall-Mounted Accordion Scissor Dryer', category: 'Hangers', type: 'image', order: 4 },
  { url: '/media/hanger-5.jpg', title: 'Compact Multi-Tier Wooden Shoe Rack', category: 'Shoe Racks', type: 'image', order: 5 },
  { url: '/media/hanger-6.jpg', title: 'Integrated Laundry & Valet Storage', category: 'Projects', type: 'image', order: 6 },
  { url: '/media/hanger-7.jpg', title: 'Heavy-Duty 6-Rod Ceiling Pulley', category: 'Hangers', type: 'image', order: 7 },
  { url: '/media/hanger-8.jpg', title: 'Minimalist Entryway Shoe Cabinet', category: 'Shoe Racks', type: 'image', order: 8 },
  { url: '/media/hanger-demo.mp4', title: 'Ceiling Pulley Demonstration Video', category: 'Hangers', type: 'video', order: 9 },
];

async function connectWithRetry(retries = 5, delay = 3000) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hanger_commerce';
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`Connecting to MongoDB (attempt ${i}/${retries})...`);
      await mongoose.connect(uri);
      console.log('✓ MongoDB connected successfully.');
      return;
    } catch (err) {
      console.warn(`Connection failed: ${err.message}`);
      if (i === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export async function seedDatabase() {
  await connectWithRetry();

  console.log('--- Starting non-destructive seed ---');

  // 1. Seed or update Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminExists = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!adminExists) {
    const passwordHash = await hash(adminPassword);
    await User.create({
      name: 'Super Admin',
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: 'admin',
      phone: '+919876543210',
      city: 'Mumbai',
      pincode: '400001',
      acceptedTerms: true,
    });
    console.log(`✓ Admin user created (${adminEmail})`);
  } else {
    console.log(`✓ Admin user exists (${adminEmail})`);
  }

  // 2. Seed or update Demo Customer
  const customerEmail = 'customer@example.com';
  const customerExists = await User.findOne({ email: customerEmail });
  if (!customerExists) {
    const passwordHash = await hash('Customer@123');
    await User.create({
      name: 'Demo Customer',
      email: customerEmail,
      passwordHash,
      role: 'customer',
      phone: '+919876543211',
      city: 'Bengaluru',
      pincode: '560001',
      acceptedTerms: true,
    });
    console.log(`✓ Demo customer created (${customerEmail})`);
  }

  // 3. Seed 3-Level Categories
  console.log('Seeding categories...');
  const categoryMap = new Map();

  // First pass: Level 1
  for (const cat of initialCategories.filter((c) => c.level === 1)) {
    let doc = await Category.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await Category.create({
        name: cat.name,
        slug: cat.slug,
        level: 1,
        icon: cat.icon,
        order: cat.order,
        description: cat.description,
      });
    }
    categoryMap.set(cat.slug, doc._id);
  }

  // Second pass: Level 2
  for (const cat of initialCategories.filter((c) => c.level === 2)) {
    const parentId = categoryMap.get(cat.parentSlug);
    let doc = await Category.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await Category.create({
        name: cat.name,
        slug: cat.slug,
        level: 2,
        parent: parentId || null,
        order: cat.order,
      });
    }
    categoryMap.set(cat.slug, doc._id);
  }

  // Third pass: Level 3
  for (const cat of initialCategories.filter((c) => c.level === 3)) {
    const parentId = categoryMap.get(cat.parentSlug);
    let doc = await Category.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await Category.create({
        name: cat.name,
        slug: cat.slug,
        level: 3,
        parent: parentId || null,
        order: cat.order,
      });
    }
    categoryMap.set(cat.slug, doc._id);
  }
  console.log(`✓ ${categoryMap.size} categories verified/seeded.`);

  // 4. Seed Products (non-destructive: upsert by SKU / slug)
  console.log('Seeding products...');
  for (const p of demoProducts) {
    const existing = await Product.findOne({ $or: [{ sku: p.sku }, { slug: p.slug }] });
    if (!existing) {
      await Product.create({
        ...p,
        mrp: p.compareAtPrice || p.price,
        discount: p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0,
        status: 'active',
      });
    } else {
      // Add missing fields additively without deleting existing customer reviews or stock
      await Product.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: existing.name || p.name,
            modelName: existing.modelName || p.modelName,
            productType: existing.productType || p.productType,
            category: existing.category || p.category,
            shortDescription: existing.shortDescription || p.shortDescription,
            description: existing.description || p.description,
            features: existing.features?.length ? existing.features : p.features,
            tags: existing.tags?.length ? existing.tags : p.tags,
            specifications: existing.specifications?.length ? existing.specifications : p.specifications,
            mrp: existing.mrp || existing.compareAtPrice || p.compareAtPrice || p.price,
            compareAtPrice: existing.compareAtPrice || p.compareAtPrice,
            status: existing.status || 'active',
          },
        }
      );
    }
  }
  const totalProducts = await Product.countDocuments();
  console.log(`✓ ${totalProducts} products present in database.`);

  // 5. Seed Settings Singleton
  let settings = await Setting.findOne({ key: 'site_settings' });
  if (!settings) {
    settings = await Setting.create({
      key: 'site_settings',
      businessName: 'HangerHome',
      tagline: 'Smart Space. Smarter Living.',
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
      },
      shippingRules: { flatRate: 99, freeShippingThreshold: 3000 },
      taxPercent: 0,
      paymentMethods: { cod: true, razorpay: true },
      announcementText: 'Complimentary site measurement and professional installation available across major cities.',
      stats: { homes: 1000, years: 5, products: 20, satisfaction: 99 },
    });
    console.log('✓ Default settings created.');
  }

  // Also sync to Content collection key 'site' for backward compatibility
  await Content.updateOne(
    { key: 'site' },
    {
      $set: {
        key: 'site',
        value: {
          brand: settings.businessName,
          tagline: settings.tagline,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          address: settings.address,
          serviceAreas: settings.serviceArea,
          announcement: settings.announcementText,
        },
      },
    },
    { upsert: true }
  );

  // 6. Seed FAQs
  for (const faq of initialFaqs) {
    await Faq.updateOne(
      { question: faq.question },
      { $set: faq },
      { upsert: true }
    );
  }
  console.log(`✓ FAQs seeded.`);

  // 7. Seed Testimonials
  for (const test of initialTestimonials) {
    await Testimonial.updateOne(
      { name: test.name },
      { $set: test },
      { upsert: true }
    );
  }
  console.log(`✓ Testimonials seeded.`);

  // 8. Seed GalleryItems
  for (const item of initialGalleryItems) {
    await GalleryItem.updateOne(
      { url: item.url },
      { $set: item },
      { upsert: true }
    );
  }
  // Also sync to Content key 'gallery' for legacy components
  const allGallery = await GalleryItem.find({ isActive: true }).sort({ order: 1 });
  await Content.updateOne(
    { key: 'gallery' },
    { $set: { key: 'gallery', value: { items: allGallery.map(g => ({ src: g.url, title: g.title, category: g.category })) } } },
    { upsert: true }
  );
  console.log(`✓ Gallery items seeded.`);

  // 9. Seed Default Coupons
  const coupons = [
    { code: 'WELCOME10', type: 'percent', value: 10, minimumOrder: 1500, minOrder: 1500, usageLimit: 500, isActive: true, active: true },
    { code: 'HANGERHOME500', type: 'fixed', value: 500, minimumOrder: 4000, minOrder: 4000, usageLimit: 200, isActive: true, active: true },
    { code: 'FESTIVE15', type: 'percent', value: 15, minimumOrder: 5000, minOrder: 5000, usageLimit: 100, isActive: true, active: true },
  ];
  for (const cp of coupons) {
    await Coupon.updateOne({ code: cp.code }, { $set: cp }, { upsert: true });
  }
  console.log(`✓ Coupons seeded.`);

  console.log('--- Database seed completed successfully ---');
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed script error:', err);
      process.exit(1);
    });
}
