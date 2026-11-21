const mongoose = require('mongoose');

/** Photo schema: metadata for an uploaded image; the file itself lives in server/uploads/. */
const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: [true, 'File name is required'] },
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);
