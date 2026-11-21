const bcrypt = require('bcryptjs');
const User = require('../models/User');

/** POST /api/auth/register - hash password, create user, return public profile (201). */
exports.register = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'This email is already registered.', errors: ['This email is already registered.'] });

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashed });
    return res.status(201).json(user.toPublic());
  } catch (err) {
    return next(err);
  }
};

/** POST /api/auth/login - compare against the stored bcrypt hash, return public profile. */
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(req.body.password, user.password));
    if (!ok) return res.status(401).json({ message: 'Invalid email or password.', errors: ['Invalid email or password.'] });
    return res.json(user.toPublic());
  } catch (err) {
    return next(err);
  }
};
