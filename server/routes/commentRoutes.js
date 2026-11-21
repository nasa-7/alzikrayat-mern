const router = require('express').Router();
const commentController = require('../controllers/commentController');
const { requireUser } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

router.get('/api/photos/:id/comments', commentController.getByPhoto);
router.post('/api/photos/:id/comments', requireUser, validate('comment'), commentController.create);

module.exports = router;
