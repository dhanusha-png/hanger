import 'dotenv/config';
import mongoose from 'mongoose';
import { User, Product, Content, Coupon } from './models/index.js';
import { hash } from './utils/auth.js';
import { demoProducts } from './demo-products.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hanger_commerce');
  console.log('MongoDB connected');

  await User.updateOne(
    { email: 'admin@example.com' },
    { $set: { name: 'Super Admin', email: 'admin@example.com', passwordHash: await hash('Admin@123'), role: 'admin' } },
    { upsert: true }
  );

  await User.updateOne(
    { email: 'customer@example.com' },
    { $set: { name: 'Demo Customer', email: 'customer@example.com', passwordHash: await hash('Customer@123'), role: 'customer' } },
    { upsert: true }
  );

  for (const product of demoProducts) {
    await Product.updateOne({ sku: product.sku }, { $set: product }, { upsert: true });
  }

  const validSkus = demoProducts.map(product => product.sku);
  await Product.deleteMany({ sku: { $nin: validSkus } });

  await Content.updateOne(
    { key: 'site' },
    {
      $set: {
        key: 'site',
        value: {
          brand: 'HangerHome',
          tagline: 'Smart Space. Smarter Living.',
          phone: '',
          whatsapp: '',
          email: '',
          address: '',
          serviceAreas: ''
        }
      }
    },
    { upsert: true }
  );

  await Content.updateOne(
    { key: 'gallery' },
    {
      $set: {
        key: 'gallery',
        value: {
          items: [1,2,3,4,5,6,7,8].map(i => ({
            src: `/media/hanger-${i}.jpg`,
            title: `HangerHome installation ${i}`,
            category: 'Hangers'
          }))
        }
      }
    },
    { upsert: true }
  );

  await Coupon.updateOne(
    { code: 'WELCOME10' },
    { $set: { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 1000, active: true } },
    { upsert: true }
  );

  const total = await Product.countDocuments({ isActive: true });
  const hangers = await Product.countDocuments({ category: 'Hangers', isActive: true });
  const shoeRacks = await Product.countDocuments({ category: 'Shoe Racks', isActive: true });
  console.log(`Seed complete: ${total} active products (${hangers} hangers, ${shoeRacks} shoe racks).`);
  console.log('Admin: admin@example.com / Admin@123');
  console.log('Customer: customer@example.com / Customer@123');
  await mongoose.disconnect();
}

run().catch(error => {
  console.error('Seed failed:', error);
  process.exit(1);
});
