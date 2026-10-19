import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from './models/index.js';
import { demoProducts } from './demo-products.js';

async function seedDemoProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hanger_commerce');
    console.log('Connected to MongoDB.');

    // Upsert all 20 demo products by stable SKU to avoid duplicate key conflicts
    for (const product of demoProducts) {
      await Product.updateOne(
        { sku: product.sku },
        { $set: product },
        { upsert: true }
      );
    }

    // Ensure any legacy slugs outside these 20 SKUs are removed
    const validSkus = demoProducts.map(p => p.sku);
    const deleteResult = await Product.deleteMany({ sku: { $nin: validSkus } });
    if (deleteResult.deletedCount > 0) {
      console.log(`Cleaned up ${deleteResult.deletedCount} outdated product records.`);
    }

    const currentCount = await Product.countDocuments({ isActive: true });
    const hangerCount = await Product.countDocuments({ category: 'Hangers', isActive: true });
    const shoeCount = await Product.countDocuments({ category: 'Shoe Racks', isActive: true });

    console.log(`Demo catalog seed complete:`);
    console.log(`- Total products: ${currentCount}`);
    console.log(`- Hangers: ${hangerCount}`);
    console.log(`- Shoe Racks: ${shoeCount}`);
  } catch (error) {
    console.error('Demo catalog seed failed:', error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  }
}

seedDemoProducts();
