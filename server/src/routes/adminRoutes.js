import express from 'express';
import mongoose from 'mongoose';
import {
  User,
  Product,
  Category,
  Order,
  Enquiry,
  Contact,
  Booking,
  Service,
  GalleryItem,
  Review,
  Faq,
  Testimonial,
  Setting,
  Coupon,
  Subscriber,
  AuditLog,
  Content,
  Quote,
} from '../models/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { recordAudit } from '../utils/audit.js';
import { hash } from '../utils/auth.js';

const router = express.Router();

// Require authenticated staff or admin for all admin API endpoints
router.use(requireAuth, requireRole('admin', 'staff'));

// Helper for pagination
function getPagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// -------------------------------------------------------------
// 1. Dashboard Stats
// -------------------------------------------------------------
router.get('/stats', async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      productsCount,
      ordersCount,
      customersCount,
      newBookingsCount,
      newEnquiriesCount,
      revenueAgg,
      lowStockProducts,
      ordersByStatusAgg,
      recentOrders,
      recentEnquiries,
      salesTrendAgg,
      topSellingAgg,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments({ status: { $in: ['new', 'scheduled'] } }),
      Enquiry.countDocuments({ status: { $in: ['new', 'New'] } }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.find({ stock: { $lte: 5 } }).select('name sku stock price category images').limit(10),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name email'),
      Enquiry.find().sort({ createdAt: -1 }).limit(6),
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalQty: { $sum: '$items.qty' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      products: productsCount,
      orders: ordersCount,
      customers: customersCount,
      services: newBookingsCount,
      bookings: newBookingsCount,
      contacts: newEnquiriesCount,
      enquiries: newEnquiriesCount,
      revenue: totalRevenue,
      lowStockProducts,
      ordersByStatus: ordersByStatusAgg,
      salesLast30Days: salesTrendAgg,
      topSelling: topSellingAgg,
      recentOrders,
      recentEnquiries,
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 2. Products Management
// -------------------------------------------------------------
router.get('/products', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { search, category, status, sort } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { modelName: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'stock_asc') sortOption = { stock: 1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    // Backward-compatible: if caller expects plain array (like legacy main.jsx),
    // but also support pagination headers and object format
    res.setHeader('X-Total-Count', total);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const product = await Product.create(data);
    await recordAudit(req, 'create_product', 'Product', product._id, { name: product.name, sku: product.sku });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    await recordAudit(req, 'update_product', 'Product', product._id, { name: product.name });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      await recordAudit(req, 'delete_product', 'Product', req.params.id, { name: product.name });
    }
    res.json({ ok: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

router.post('/products/:id/duplicate', async (req, res, next) => {
  try {
    const source = await Product.findById(req.params.id);
    if (!source) return res.status(404).json({ message: 'Source product not found.' });

    const copyData = source.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;

    copyData.name = `${source.name} (Copy)`;
    copyData.slug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
    copyData.sku = source.sku ? `${source.sku}-COPY` : undefined;
    copyData.status = 'draft';

    const duplicate = await Product.create(copyData);
    await recordAudit(req, 'duplicate_product', 'Product', duplicate._id, { originalId: source._id });
    res.status(201).json(duplicate);
  } catch (err) {
    next(err);
  }
});

router.patch('/products/bulk-status', async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !ids.length || !status) {
      return res.status(400).json({ message: 'ids array and status are required.' });
    }
    await Product.updateMany({ _id: { $in: ids } }, { $set: { status, isActive: status === 'active' } });
    await recordAudit(req, 'bulk_status_products', 'Product', '', { count: ids.length, status });
    res.json({ ok: true, updated: ids.length });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 3. Categories Management (3 Levels)
// -------------------------------------------------------------
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.find().populate('parent', 'name slug level').sort({ level: 1, order: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post('/categories', async (req, res, next) => {
  try {
    const { name, slug, parent, level, icon, image, order, isActive, description } = req.body;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await Category.create({
      name,
      slug: catSlug,
      parent: parent || null,
      level: Number(level) || 1,
      icon: icon || '',
      image: image || '',
      order: Number(order) || 0,
      isActive: isActive !== false,
      description: description || '',
    });
    await recordAudit(req, 'create_category', 'Category', category._id, { name: category.name });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    await recordAudit(req, 'update_category', 'Category', category._id, { name: category.name });
    res.json(category);
  } catch (err) {
    next(err);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    // Check if subcategories exist
    const subCount = await Category.countDocuments({ parent: req.params.id });
    if (subCount > 0) {
      return res.status(400).json({ message: 'Cannot delete category that contains subcategories. Delete children first.' });
    }
    await Category.findByIdAndDelete(req.params.id);
    await recordAudit(req, 'delete_category', 'Category', req.params.id);
    res.json({ ok: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
});

router.put('/categories/reorder', async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (Array.isArray(items)) {
      const ops = items.map((it) => ({
        updateOne: {
          filter: { _id: it.id },
          update: { $set: { order: it.order } },
        },
      }));
      await Category.bulkWrite(ops);
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 4. Orders Management
// -------------------------------------------------------------
router.get('/orders', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { search, status, paymentStatus } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.setHeader('X-Total-Count', total);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    const prevStatus = order.status;
    const { status, paymentStatus, adminNotes, note } = req.body;

    if (status && status !== prevStatus) {
      order.status = status;
      order.tracking.push({
        status,
        note: note || `Order status updated to ${status} by admin`,
        at: new Date(),
        by: req.user.name || 'Admin',
      });

      // If status changed to cancelled from an active state, restore inventory!
      if (status === 'cancelled' && prevStatus !== 'cancelled') {
        order.isCancelled = true;
        for (const it of order.items) {
          if (it.product) {
            await Product.findByIdAndUpdate(it.product, { $inc: { stock: it.qty } });
          }
        }
      }
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    await order.save();
    await recordAudit(req, 'update_order', 'Order', order._id, { status, paymentStatus });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.post('/orders/:id/cancel', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (order.status !== 'cancelled') {
      order.status = 'cancelled';
      order.isCancelled = true;
      order.tracking.push({
        status: 'cancelled',
        note: req.body.reason || 'Order cancelled by administrator',
        at: new Date(),
        by: req.user.name,
      });

      // Restore inventory
      for (const it of order.items) {
        if (it.product) {
          await Product.findByIdAndUpdate(it.product, { $inc: { stock: it.qty } });
        }
      }

      await order.save();
      await recordAudit(req, 'cancel_order', 'Order', order._id);
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 5. Customers Management
// -------------------------------------------------------------
router.get('/customers', async (req, res, next) => {
  try {
    const { search, isBlocked } = req.query;
    const filter = { role: 'customer' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (isBlocked !== undefined) {
      filter.isBlocked = isBlocked === 'true';
    }

    const customers = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

router.get('/customers/:id', async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-passwordHash');
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });

    const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 });
    const totalSpend = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (o.total || 0), 0);

    res.json({ customer, orders, totalSpend });
  } catch (err) {
    next(err);
  }
});

router.patch('/customers/:id/block', async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });

    customer.isBlocked = !customer.isBlocked;
    await customer.save();

    await recordAudit(req, customer.isBlocked ? 'block_customer' : 'unblock_customer', 'User', customer._id);
    res.json({ ok: true, isBlocked: customer.isBlocked });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 6. Enquiries & Contacts Management
// -------------------------------------------------------------
router.get('/enquiries', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    next(err);
  }
});

// Alias for legacy frontend /api/admin/contacts
router.get('/contacts', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    res.json(await Contact.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.put('/enquiries/:id', async (req, res, next) => {
  try {
    const item = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/contacts/:id', async (req, res, next) => {
  try {
    const item = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/enquiries/:id', async (req, res, next) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/enquiries/export', async (req, res, next) => {
  try {
    const list = await Enquiry.find().sort({ createdAt: -1 });
    const header = 'Name,Email,Phone,Requirement,Status,Date\n';
    const rows = list
      .map(
        (e) =>
          `"${(e.name || '').replace(/"/g, '""')}","${e.email || ''}","${e.phone || ''}","${(e.requirement || '').replace(/"/g, '""')}","${e.status}","${new Date(e.createdAt).toISOString()}"`
      )
      .join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hangerhome-enquiries.csv"');
    res.send(header + rows);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 7. Bookings & Services Management
// -------------------------------------------------------------
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (type) filter.type = type;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// Alias for legacy frontend /api/admin/services
router.get('/services', async (req, res, next) => {
  try {
    res.json(await Service.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.put('/bookings/:id', async (req, res, next) => {
  try {
    const item = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/services/:id', async (req, res, next) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/bookings/:id', async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Legacy Quotes
router.get('/quotes', async (req, res, next) => {
  try {
    res.json(await Quote.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.put('/quotes/:id', async (req, res, next) => {
  try {
    const item = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 8. Gallery Management
// -------------------------------------------------------------
router.get('/gallery', async (req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/gallery', async (req, res, next) => {
  try {
    const item = await GalleryItem.create(req.body);
    await recordAudit(req, 'create_gallery_item', 'GalleryItem', item._id);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/gallery/:id', async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/gallery/:id', async (req, res, next) => {
  try {
    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.put('/gallery/reorder', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      const ops = items.map((it) => ({
        updateOne: {
          filter: { _id: it.id },
          update: { $set: { order: it.order } },
        },
      }));
      await GalleryItem.bulkWrite(ops);
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 9. Reviews Moderation
// -------------------------------------------------------------
router.get('/reviews', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const reviews = await Review.find(filter).populate('product', 'name slug').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.put('/reviews/:id', async (req, res, next) => {
  try {
    const { status, approved } = req.body;
    const isApproved = status === 'approved' || approved === true;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: isApproved ? 'approved' : status || 'rejected',
        approved: isApproved,
      },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.delete('/reviews/:id', async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 10. FAQs Management
// -------------------------------------------------------------
router.get('/faqs', async (req, res, next) => {
  try {
    const faqs = await Faq.find().sort({ group: 1, order: 1 });
    res.json(faqs);
  } catch (err) {
    next(err);
  }
});

router.post('/faqs', async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    next(err);
  }
});

router.put('/faqs/:id', async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(faq);
  } catch (err) {
    next(err);
  }
});

router.delete('/faqs/:id', async (req, res, next) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 11. Testimonials Management
// -------------------------------------------------------------
router.get('/testimonials', async (req, res, next) => {
  try {
    const list = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post('/testimonials', async (req, res, next) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/testimonials/:id', async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/testimonials/:id', async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 12. Coupons Management
// -------------------------------------------------------------
router.get('/coupons', async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    next(err);
  }
});

router.post('/coupons', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.code) data.code = String(data.code).toUpperCase().trim();
    const coupon = await Coupon.create(data);
    await recordAudit(req, 'create_coupon', 'Coupon', coupon._id, { code: coupon.code });
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
});

router.put('/coupons/:id', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.code) data.code = String(data.code).toUpperCase().trim();
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(coupon);
  } catch (err) {
    next(err);
  }
});

router.delete('/coupons/:id', async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 13. Newsletter Subscribers
// -------------------------------------------------------------
router.get('/subscribers', async (req, res, next) => {
  try {
    const list = await Subscriber.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get('/subscribers/export', async (req, res, next) => {
  try {
    const list = await Subscriber.find().sort({ createdAt: -1 });
    const header = 'Email,Status,SubscribedAt\n';
    const rows = list.map((s) => `"${s.email}","${s.status}","${new Date(s.createdAt).toISOString()}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hangerhome-subscribers.csv"');
    res.send(header + rows);
  } catch (err) {
    next(err);
  }
});

router.delete('/subscribers/:id', async (req, res, next) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 14. Settings Management
// -------------------------------------------------------------
router.get('/settings', async (req, res, next) => {
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

router.put('/settings', async (req, res, next) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'site_settings' },
      { $set: req.body },
      { new: true, upsert: true }
    );

    // Also sync to Content key 'site' for backward compatibility
    await Content.updateOne(
      { key: 'site' },
      {
        $set: {
          key: 'site',
          value: {
            brand: updated.businessName,
            tagline: updated.tagline,
            phone: updated.phone,
            whatsapp: updated.whatsapp,
            email: updated.email,
            address: updated.address,
            serviceAreas: updated.serviceArea,
            announcement: updated.announcementText,
          },
        },
      },
      { upsert: true }
    );

    await recordAudit(req, 'update_settings', 'Setting', updated._id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Legacy Content key route
router.put('/content/:key', async (req, res, next) => {
  try {
    const c = await Content.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value: req.body },
      { upsert: true, new: true }
    );
    res.json(c);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 15. Admin / Staff Users Management (Admin-only guard)
// -------------------------------------------------------------
router.get('/users', requireRole('admin'), async (req, res, next) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'staff'] } })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/users', requireRole('admin'), async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await hash(password);
    const user = await User.create({
      name,
      email: String(email).trim().toLowerCase(),
      passwordHash,
      role: ['admin', 'staff'].includes(role) ? role : 'staff',
      phone: phone || '',
    });

    await recordAudit(req, 'create_staff_user', 'User', user._id, { role: user.role });
    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { role, name, phone, isBlocked } = req.body;
    const update = {};
    if (role) update.role = role;
    if (name) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (isBlocked !== undefined) update.isBlocked = isBlocked;

    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// 16. Audit Log
// -------------------------------------------------------------
router.get('/audit-logs', requireRole('admin'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { entity, action } = req.query;

    const filter = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.setHeader('X-Total-Count', total);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
