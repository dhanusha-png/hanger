import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const UPLOADS_DIR = path.resolve('uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Allowed file extensions and mime types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/webm',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm'];

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 40);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Only JPG, PNG, WEBP, and MP4 are allowed.`));
  }
}

export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (for demo videos & high-res photos)
  },
  fileFilter,
});

/**
 * Optimizes an uploaded image using Sharp:
 * Resizes max width 1920px (preserving aspect ratio) and converts to WebP.
 * If file is a video, leaves it unchanged.
 */
export async function processUploadedFile(file) {
  if (!file) return null;
  const isVideo = file.mimetype.startsWith('video/') || file.filename.endsWith('.mp4');
  if (isVideo) {
    return {
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      type: 'video',
      size: file.size,
    };
  }

  // It is an image: convert to webp and optimize
  const ext = path.extname(file.filename);
  const webpFilename = file.filename.replace(ext, '') + '.webp';
  const webpPath = path.join(UPLOADS_DIR, webpFilename);

  try {
    await sharp(file.path)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(webpPath);

    // Optionally remove original if it was not webp to save disk space
    if (file.path !== webpPath) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }

    return {
      url: `/uploads/${webpFilename}`,
      name: file.originalname,
      type: 'image',
      size: (fs.statSync(webpPath)).size,
    };
  } catch (err) {
    console.warn(`Sharp processing failed for ${file.filename}, falling back to original:`, err.message);
    return {
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      type: 'image',
      size: file.size,
    };
  }
}

/**
 * Cloudinary-ready storage abstraction wrapper
 */
export async function uploadToStorage(filePath, options = {}) {
  // If Cloudinary credentials exist in environment, upload to Cloudinary:
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const cloudinary = (await import('cloudinary')).v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'hangerhome',
        resource_type: 'auto',
        ...options,
      });
      return { url: result.secure_url, publicId: result.public_id };
    } catch (err) {
      console.error('Cloudinary upload failed, falling back to local:', err.message);
    }
  }

  // Default: local static URL
  const filename = path.basename(filePath);
  return { url: `/uploads/${filename}` };
}
