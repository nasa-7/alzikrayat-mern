const router = require('express').Router();
const photoController = require('../controllers/photoController');
const { requireUser } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { validate } = require('../middleware/validation');

router.get('/api/photos', photoController.getAll);
router.get('/api/photos/:id', photoController.getOne);
// requireUser runs before multer so unauthenticated requests never write a file.
router.post('/api/photos', requireUser, upload.single('photo'), validate('photo'), photoController.create);
router.delete('/api/photos/:id', requireUser, photoController.remove);

module.exports = router;
