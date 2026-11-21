const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Basic identity check (Project 3 scope - no JWT).
 * The client sends the logged-in user's id in the `X-User-Id` header; we confirm
 * that user exists and attach it as req.user. Write routes use this middleware.
 */
const requireUser = async (req, res, next) => {
  try {
    const id = req.get('X-User-Id');
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(401).json({ message: 'Please log in to do that.' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'Please log in to do that.' });
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { requireUser };
