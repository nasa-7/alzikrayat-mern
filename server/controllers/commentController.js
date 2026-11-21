const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

const AUTHOR_FIELDS = 'firstName lastName';

/** GET /api/photos/:id/comments - oldest first, with commenter name. */
exports.getByPhoto = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Photo not found.' });
    const comments = await Comment.find({ photoId: req.params.id }).sort({ dateTime: 1 }).populate('userId', AUTHOR_FIELDS);
    return res.json(comments);
  } catch (err) {
    return next(err);
  }
};

/** POST /api/photos/:id/comments - any logged-in user; returns the new comment populated. */
exports.create = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !(await Photo.exists({ _id: req.params.id }))) {
      return res.status(404).json({ message: 'Photo not found.' });
    }
    const created = await Comment.create({ photoId: req.params.id, userId: req.user._id, comment: req.body.comment });
    const populated = await created.populate('userId', AUTHOR_FIELDS);
    return res.status(201).json(populated);
  } catch (err) {
    return next(err);
  }
};
