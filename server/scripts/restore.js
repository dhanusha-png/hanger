import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hanger_commerce';
const backupsBase = path.join(serverRoot, 'backups');

// Find specified backup or the most recent one
let targetBackupDir = process.argv[2];
if (!targetBackupDir) {
  if (!fs.existsSync(backupsBase)) {
    console.error('No backups directory found.');
    process.exit(1);
  }
  const entries = fs.readdirSync(backupsBase).filter((f) => f.startsWith('backup_')).sort();
  if (!entries.length) {
    console.error('No backups found in', backupsBase);
    process.exit(1);
  }
  targetBackupDir = path.join(backupsBase, entries[entries.length - 1]);
} else if (!path.isAbsolute(targetBackupDir)) {
  targetBackupDir = path.resolve(targetBackupDir);
}

console.log('----------------------------------------------------');
console.log(` HangerHome Database Restore Helper`);
console.log(` Source Directory: ${targetBackupDir}`);
console.log('----------------------------------------------------');

function tryMongorestore(dumpPath) {
  return new Promise((resolve, reject) => {
    const cmd = `mongorestore --uri="${MONGODB_URI}" "${dumpPath}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve({ stdout, stderr });
    });
  });
}

async function mongooseFallbackRestore() {
  console.log('Restoring collections from JSON files...');
  await mongoose.connect(MONGODB_URI);

  const files = fs.readdirSync(targetBackupDir).filter((f) => f.endsWith('.json') && f !== 'manifest.json');
  for (const file of files) {
    const colName = file.replace('.json', '');
    const raw = fs.readFileSync(path.join(targetBackupDir, file), 'utf-8');
    const docs = JSON.parse(raw);
    if (!docs.length) continue;

    const col = mongoose.connection.db.collection(colName);
    let inserted = 0;
    for (const doc of docs) {
      try {
        await col.updateOne({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });
        inserted++;
      } catch (err) {
        // Skip duplicates or continue
      }
    }
    console.log(`  ✓ Restored / verified ${inserted} records for [${colName}]`);
  }

  await mongoose.disconnect();
  console.log('\nRestore completed successfully.');
}

async function run() {
  const dumpSubdir = path.join(targetBackupDir, 'dump');
  if (fs.existsSync(dumpSubdir)) {
    try {
      await tryMongorestore(dumpSubdir);
      console.log('✓ Binary mongorestore completed successfully.');
      return;
    } catch {
      console.log('mongorestore CLI failed or unavailable. Falling back to native JSON import...');
    }
  }
  await mongooseFallbackRestore();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Database restore failed:', err);
    process.exit(1);
  });
