const mongoose = require('mongoose');

/**
 * User schema (Data tier). The password field always stores a bcrypt hash.
 * `select: false` keeps the hash out of every query unless explicitly requested.
 */
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'], trim: true, maxlength: 50 },
  lastName: { type: String, required: [true, 'Last name is required'], trim: true, maxlength: 50 },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
  },
  password: { type: String, required: [true, 'Password is required'], select: false },
  location: { type: String, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  occupation: { type: String, trim: true, maxlength: 100 },
});

/** Public profile: everything except the password hash. */
userSchema.methods.toPublic = function toPublic() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    location: this.location,
    description: this.description,
    occupation: this.occupation,
  };
};

module.exports = mongoose.model('User', userSchema);
