const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp' };

/** multer: stores images on disk with a random, collision-safe name; 5 MB, images only. */
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, `photo_${crypto.randomBytes(8).toString('hex')}${ALLOWED[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    const err = new Error('Only JPG, PNG, GIF, or WEBP images are allowed.');
    err.status = 400;
    return cb(err);
  },
});

module.exports = { upload, UPLOAD_DIR };
