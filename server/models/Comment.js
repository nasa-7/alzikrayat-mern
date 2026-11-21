const mongoose = require('mongoose');

/** Comment schema: references both the photo and the commenting user. */
const commentSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: [true, 'Comment text is required'], trim: true, maxlength: 1000 },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
