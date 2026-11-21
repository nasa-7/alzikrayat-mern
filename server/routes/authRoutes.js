const router = require('express').Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');

router.post('/api/auth/register', validate('register'), authController.register);
router.post('/api/auth/login', validate('login'), authController.login);

module.exports = router;
