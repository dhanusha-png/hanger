import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  Product,
  Category,
  Order,
  Enquiry,
  Contact,
  Booking,
  Service,
  Quote,
  GalleryItem,
  Review,
  Faq,
  Testimonial,
  Setting,
  Coupon,
  Subscriber,
  Content,
  Notification,
} from '../models/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { sendOrderConfirmationEmail, sendAdminNotification } from '../utils/mailer.js';

const router = express.Router();

// Helper to generate sequential order number: HH-2026-XXXXXX
async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments();
  const seq = String(count + 1).padStart(6, '0');
  return `HH-${year}-${seq}`;
}

// -------------------------------------------------------------
// 1. Categories & 3-Level Hierarchy
// -------------------------------------------------------------
router.get('/categories', async (_req, res, next) => {
  try {
    const [categories, products] = await Promise.all([
      Category.find({ isActive: true }).sort({ level: 1, order: 1 }),
      Product.find({ isActive: true }).select('category subCategory type'),
    ]);

    // Compute live product counts per category
    const catCounts = {};
    for (const p of products) {
      if (p.category) {
        catCounts[p.category.toLowerCase()] = (catCounts[p.category.toLowerCase()] || 0) + 1;
      }
      if (p.subCategory) {
        catCounts[p.subCategory.toLowerCase()] = (catCounts[p.subCategory.toLowerCase()] || 0) + 1;
      }
      if (p.type) {
        catCounts[p.type.toLowerCase()] = (catCounts[p.type.toLowerCase()] || 0) + 1;
      }
    }

    const categoriesWithCount = categories.map((c) => {
      const doc = c.toObject();
      const count = catCounts[c.name.toLowerCase()] || catCounts[c.slug.toLowerCase()] || 0;
      doc.count = count;
      return doc;
    });

    res.json(categoriesWithCount);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 2. Products Catalog
// -------------------------------------------------------------
router.get('/products', async (req, res, next) => {
  try {
    const { category, subCategory, type, featured, search, sort, limit } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.$or = [
        { category: new RegExp(`^${category}$`, 'i') },
        { tags: { $in: [new RegExp(category, 'i')] } },
      ];
    }
    if (subCategory) {
      filter.subCategory = new RegExp(subCategory, 'i');
    }
    if (type) {
      filter.type = new RegExp(type, 'i');
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { modelName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    let query = Product.find(filter).sort(sortOption);
    if (limit) query = query.limit(parseInt(limit, 10));

    const products = await query;
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/products/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const reviews = await Review.find({ product: product._id, approved: true })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({ product, reviews });
  } catch (err) {
    next(err);
  }
});

router.post('/products/:id/reviews', requireAuth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const purchased = await Order.exists({
      user: req.user._id,
      'items.product': product._id,
      status: { $in: ['delivered', 'confirmed', 'shipped'] },
    });

    const rating = Math.min(5, Math.max(1, Number(req.body.rating) || 5));
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar || '',
      rating,
      title: req.body.title || '',
      body: req.body.body || req.body.comment || '',
      comment: req.body.body || req.body.comment || '',
      verified: Boolean(purchased),
      status: 'approved',
      approved: true,
    });

    // Update aggregate product rating
    const agg = await Review.aggregate([
      { $match: { product: product._id, approved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    await Product.findByIdAndUpdate(product._id, {
      rating: agg[0]?.avg ? Number(agg[0].avg.toFixed(1)) : rating,
      reviewCount: agg[0]?.count || 1,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

router.get('/reviews', async (_req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true })
      .populate('product', 'name slug images')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 3. FAQs & Testimonials
// -------------------------------------------------------------
router.get('/faqs', async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.group) filter.group = req.query.group;
    const faqs = await Faq.find(filter).sort({ group: 1, order: 1 });
    res.json(faqs);
  } catch (err) {
    next(err);
  }
});

router.get('/testimonials', async (_req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 4. Gallery Items & Legacy Content
// -------------------------------------------------------------
router.get('/gallery', async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const items = await GalleryItem.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Backward-compatible route for /api/content/gallery
router.get('/content/gallery', async (_req, res, next) => {
  try {
    const items = await GalleryItem.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    if (items.length) {
      return res.json({ items: items.map((i) => ({ src: i.url, title: i.title, category: i.category, type: i.type })) });
    }
    // Fallback to Content collection
    const c = await Content.findOne({ key: 'gallery' });
    res.json(c?.value || { items: [] });
  } catch (err) {
    next(err);
  }
});

// Backward-compatible route for /api/content/:key
router.get('/content/:key', async (req, res, next) => {
  try {
    if (req.params.key === 'site') {
      const s = await Setting.findOne({ key: 'site_settings' });
      if (s) {
        return res.json({
          brand: s.businessName,
          tagline: s.tagline,
          phone: s.phone,
          whatsapp: s.whatsapp,
          email: s.email,
          address: s.address,
          serviceAreas: s.serviceArea,
          announcement: s.announcementText,
          stats: s.stats,
          workingHours: s.workingHours,
        });
      }
    }
    const c = await Content.findOne({ key: req.params.key });
    res.json(c?.value || {});
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 5. Site Settings
// -------------------------------------------------------------
router.get('/settings', async (_req, res, next) => {
  try {
    let settings = await Setting.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = await Setting.create({ key: 'site_settings' });
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 6. Lead Submissions: Enquiry / Contact, Booking / Services, Quote, Newsletter
// -------------------------------------------------------------
router.post('/subscribers', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }
    await Subscriber.updateOne(
      { email: String(email).trim().toLowerCase() },
      { $set: { email: String(email).trim().toLowerCase(), status: 'active' } },
      { upsert: true }
    );
    res.status(201).json({ message: 'Thank you for subscribing to HangerHome updates!' });
  } catch (err) {
    next(err);
  }
});

// Contact / Enquiry (supporting both /api/contact and /api/enquiries)
async function handleEnquiry(req, res, next) {
  try {
    const { name, email, phone, requirement, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const enquiry = await Enquiry.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      requirement: requirement || 'General',
      message: String(message).trim(),
      status: 'new',
    });

    sendAdminNotification('enquiry', {
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      requirement: enquiry.requirement,
      message: enquiry.message,
    }).catch(() => {});

    res.status(201).json({
      message: 'Thank you. Your enquiry has been received. Our team will contact you shortly.',
      contact: enquiry,
      enquiry,
    });
  } catch (err) {
    next(err);
  }
}

router.post('/contact', handleEnquiry);
router.post('/enquiries', handleEnquiry);

// Booking / Service requests (supporting both /api/services and /api/bookings)
async function handleBooking(req, res, next) {
  try {
    const data = { ...req.body };
    const booking = await Booking.create(data);

    sendAdminNotification('booking', {
      type: booking.type,
      customer: booking.customer,
      address: booking.address,
      preferredDate: booking.preferredDate,
    }).catch(() => {});

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

router.post('/services', handleBooking);
router.post('/bookings', handleBooking);

router.get('/services', requireAuth, async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const list = await Booking.find(query).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post('/quotes', async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);
    sendAdminNotification('quote', quote).catch(() => {});
    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
});

router.get('/notifications', requireAuth, async (req, res, next) => {
  try {
    const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 7. Coupons Validation
// -------------------------------------------------------------
router.post('/coupons/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required.' });

    const coupon = await Coupon.findOne({
      code: String(code).trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code.' });
    }

    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired.' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon usage limit has been reached.' });
    }

    const min = coupon.minimumOrder || coupon.minOrder || 0;
    const amount = Number(subtotal) || 0;
    if (amount < min) {
      return res.status(400).json({
        message: `This coupon requires a minimum cart total of ₹${min.toLocaleString('en-IN')}.`,
      });
    }

    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round((amount * coupon.value) / 100);
    } else {
      discount = Math.min(amount, coupon.value);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discount,
      type: coupon.type,
      value: coupon.value,
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 8. Orders & Checkout (Server-Side Price & Stock Validation)
// -------------------------------------------------------------
router.post('/orders', optionalAuth, async (req, res, next) => {
  try {
    const body = req.body;
    const items = body.items || [];
    if (!items.length) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // 1. Fetch products from database to guarantee authentic prices and stock
    const productIds = items.map((i) => i.product);
    const dbProducts = await Product.find({ _id: { $in: productIds }, isActive: true });
    const productMap = new Map(dbProducts.map((p) => [String(p._id), p]));

    let subtotal = 0;
    let installationTotal = 0;
    const finalItems = [];

    for (const item of items) {
      const p = productMap.get(String(item.product));
      if (!p) {
        return res.status(400).json({ message: `Product "${item.name || 'item'}" is currently unavailable.` });
      }

      const qty = Math.max(1, Number(item.qty) || 1);

      // Verify stock
      if (p.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${p.name}". Only ${p.stock} unit(s) remaining.`,
        });
      }

      const verifiedPrice = p.price;
      const ip = item.installation ? Number(item.installationPrice) || 0 : 0;

      subtotal += verifiedPrice * qty;
      installationTotal += ip * qty;

      finalItems.push({
        product: p._id,
        name: p.name,
        image: p.images?.[0]?.url || item.image || '',
        price: verifiedPrice, // ALWAYS DB price
        qty,
        installation: Boolean(item.installation),
        installationPrice: ip,
      });
    }

    // 2. Fetch shipping rules from Settings
    const settings = await Setting.findOne({ key: 'site_settings' });
    const freeThreshold = settings?.shippingRules?.freeShippingThreshold ?? 3000;
    const flatRate = settings?.shippingRules?.flatRate ?? 99;
    const shipping = subtotal >= freeThreshold ? 0 : flatRate;

    // 3. Validate coupon if provided
    let discount = 0;
    let appliedCoupon = null;
    if (body.couponCode) {
      const coupon = await Coupon.findOne({
        code: String(body.couponCode).trim().toUpperCase(),
        isActive: true,
      });
      if (coupon) {
        const min = coupon.minimumOrder || coupon.minOrder || 0;
        if (subtotal >= min && (!coupon.expiry || new Date(coupon.expiry) >= new Date())) {
          discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : Math.min(subtotal, coupon.value);
          appliedCoupon = { code: coupon.code, discountAmount: discount };
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        }
      }
    }

    const total = Math.max(0, subtotal + installationTotal + shipping - discount);

    // 4. Generate official order number
    const orderNumber = await generateOrderNumber();

    // 5. Determine user ownership
    const ownerId = req.user ? req.user._id : body.userId && mongoose.Types.ObjectId.isValid(body.userId) ? body.userId : undefined;

    // 6. Create order
    const order = await Order.create({
      orderNumber,
      user: ownerId,
      items: finalItems,
      customer: body.customer || {},
      address: body.address || {},
      subtotal,
      installationTotal,
      shipping,
      discount,
      total,
      coupon: appliedCoupon || undefined,
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: body.paymentMethod === 'razorpay_demo' ? 'paid' : 'pending',
      status: 'confirmed',
      tracking: [
        {
          status: 'placed',
          note: 'Order placed successfully by customer',
          at: new Date(),
          by: body.customer?.name || 'Customer',
        },
        {
          status: 'confirmed',
          note: 'Order confirmed and scheduled for packaging',
          at: new Date(),
          by: 'System',
        },
      ],
    });

    // 7. Reduce inventory stock
    for (const item of finalItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    // 8. Fire non-blocking confirmation email
    sendOrderConfirmationEmail(order).catch(() => {});
    sendAdminNotification('order', {
      orderNumber: order.orderNumber,
      total: order.total,
      customer: order.customer,
      itemsCount: order.items.length,
    }).catch(() => {});

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

router.get('/orders', requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/orders/:id', optionalAuth, async (req, res, next) => {
  try {
    let order;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      order = await Order.findById(req.params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id });
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // If order has an owner and requester is logged in as someone else (and not admin), restrict
    if (order.user && req.user && req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 9. Razorpay Payment Gateway Integration (Behind Env Keys)
// -------------------------------------------------------------
router.post('/payments/razorpay/create-order', async (req, res, next) => {
  try {
    const { amount, receipt } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Mock / Demo order if live credentials are not set
      return res.json({
        id: `order_mock_${Date.now()}`,
        currency: 'INR',
        amount: Math.round(Number(amount) * 100),
        status: 'created',
        demoMode: true,
      });
    }

    // Dynamically require/import Razorpay
    const Razorpay = (await import('razorpay')).default;
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await instance.orders.create(options);
    res.json(razorpayOrder);
  } catch (err) {
    next(err);
  }
});

router.post('/payments/razorpay/verify', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      // Demo validation mode
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          'paymentDetails.razorpayOrderId': razorpay_order_id,
          'paymentDetails.razorpayPaymentId': razorpay_payment_id,
        });
      }
      return res.json({ success: true, verified: true, demo: true });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentDetails: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });
    }

    res.json({ success: true, verified: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 10. AI Concierge Chatbot
// -------------------------------------------------------------
router.post('/chat', optionalAuth, async (req, res) => {
  const message = String(req.body.message || '').trim();
  const m = message.toLowerCase();
  let reply;

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(m)) {
    reply = '👋 Hello! Welcome to HangerHome. How can I help you today? Would you like to view Products, explore Services, or check your Account?';
  } else if (m.includes('shoe')) {
    reply = 'We offer a range of premium shoe rack solutions, including multi-tier organizers, slim entryway cabinets, and compact corner units. You can open Products → Shoe Racks to explore and compare!';
  } else if (m.includes('hanger') || m.includes('product')) {
    reply = 'Our catalog features precision-engineered ceiling-mounted clothes drying hangers, foldable wall hangers, and heavy-duty drying solutions. You can browse all 20 products in our catalog with specs, pricing, and installation availability.';
  } else if (m.includes('install') || m.includes('repair') || m.includes('fix') || m.includes('service')) {
    reply = 'We provide end-to-end professional services: Hanger Installation, Repair & Fixing, Custom Hanger Making, Maintenance, and Shoe Rack Assembly. Visit our Services page to book or request a custom quote.';
  } else if (m.includes('cod') || m.includes('cash')) {
    reply = 'Yes! Cash on Delivery (COD) is available at checkout across supported delivery areas.';
  } else if (m.includes('razorpay') || m.includes('payment')) {
    reply = 'Online payments are available via Razorpay with Instant Confirmation, UPI, cards, and net banking.';
  } else if (m.includes('order')) {
    if (req.user) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(3).select('orderNumber _id status total createdAt');
      reply = orders.length
        ? `You have ${orders.length} recent order${orders.length > 1 ? 's' : ''}. ${orders
            .map((o) => `Order #${o.orderNumber || String(o._id).slice(-6).toUpperCase()} is ${o.status} for ₹${Number(o.total || 0).toLocaleString('en-IN')}.`)
            .join(' ')}`
        : 'I could not find any orders on your account yet. You can shop from Products and your orders will appear in Account → My Orders.';
    } else {
      reply = 'I can explain how orders work, but I can only access order details after you sign in. Open Login → My Orders to view your own order status.';
    }
  } else if (m.includes('contact') || m.includes('phone') || m.includes('whatsapp') || m.includes('enquiry')) {
    reply = 'You can reach us directly through our Contact page or WhatsApp. We also accept custom solution requests and site measurement bookings.';
  } else if (m.includes('return') || m.includes('refund')) {
    reply = 'We prioritize customer satisfaction. If you encounter any issue with your product or installation, our support team will promptly resolve it.';
  } else {
    reply = 'I can assist you with products, pricing, installation services, shoe racks, orders, custom solutions, and website navigation. Would you like to view Products, Services, or Contact us?';
  }

  res.json({ reply });
});

export default router;
