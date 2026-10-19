import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(serverRoot, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hanger_commerce';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const backupDir = path.join(serverRoot, 'backups', `backup_${timestamp}`);

fs.mkdirSync(backupDir, { recursive: true });

console.log('----------------------------------------------------');
console.log(` HangerHome Database Backup Helper`);
console.log(` Timestamp: ${timestamp}`);
console.log(` Destination: ${backupDir}`);
console.log('----------------------------------------------------');

// Try mongodump first; fallback to native Mongoose JSON export if mongodump CLI is unavailable
function tryMongodump() {
  return new Promise((resolve, reject) => {
    const cmd = `mongodump --uri="${MONGODB_URI}" --out="${backupDir}/dump"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
}

async function mongooseFallbackDump() {
  console.log('mongodump CLI not found or errored. Running native MongoDB collection export...');
  await mongoose.connect(MONGODB_URI);

  const collections = await mongoose.connection.db.listCollections().toArray();
  const summary = {};

  for (const colInfo of collections) {
    const colName = colInfo.name;
    if (colName.startsWith('system.')) continue;
    const col = mongoose.connection.db.collection(colName);
    const docs = await col.find({}).toArray();
    const filePath = path.join(backupDir, `${colName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
    summary[colName] = docs.length;
    console.log(`  ✓ Exported ${colName} (${docs.length} documents) -> ${colName}.json`);
  }

  const manifest = {
    createdAt: new Date().toISOString(),
    uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'),
    collections: summary,
    totalCollections: Object.keys(summary).length
  };
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  await mongoose.disconnect();
  console.log(`\nBackup successfully written to: ${backupDir}`);
}

async function run() {
  try {
    await tryMongodump();
    console.log(`✓ Binary mongodump completed successfully -> ${backupDir}/dump`);
  } catch {
    await mongooseFallbackDump();
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Database backup failed:', err);
    process.exit(1);
  });
