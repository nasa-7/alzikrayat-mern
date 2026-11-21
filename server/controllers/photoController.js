const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const { UPLOAD_DIR } = require('../middleware/upload');

const AUTHOR_FIELDS = 'firstName lastName';

/** Removes an uploaded file from disk, ignoring "already gone" errors. */
const removeFile = (fileName) => fs.promises.unlink(path.join(UPLOAD_DIR, fileName)).catch(() => {});

/** GET /api/photos - all photos, newest first, with author name and comment count. */
exports.getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find().sort({ dateTime: -1 }).populate('userId', AUTHOR_FIELDS).lean();
    const counts = await Comment.aggregate([{ $group: { _id: '$photoId', n: { $sum: 1 } } }]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.n]));
    res.json(photos.map((p) => ({ ...p, commentCount: countMap.get(String(p._id)) || 0 })));
  } catch (err) {
    next(err);
  }
};

/** GET /api/photos/:id - a single photo with author. */
exports.getOne = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Photo not found.' });
    const photo = await Photo.findById(req.params.id).populate('userId', AUTHOR_FIELDS).lean();
    if (!photo) return res.status(404).json({ message: 'Photo not found.' });
    return res.json(photo);
  } catch (err) {
    return next(err);
  }
};

/** POST /api/photos - multipart upload (field "photo"); owner = logged-in user. */
exports.create = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please choose an image file to upload.', errors: ['Please choose an image file to upload.'] });
    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description || '',
    });
    return res.status(201).json(photo);
  } catch (err) {
    if (req.file) await removeFile(req.file.filename);
    return next(err);
  }
};

/** DELETE /api/photos/:id - owner only (403 otherwise). Removes record, comments, and file. */
exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Photo not found.' });
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found.' });
    if (String(photo.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: you do not own this photo.' });
    }
    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();
    await removeFile(photo.fileName);
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};
