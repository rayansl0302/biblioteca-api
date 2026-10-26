const express = require('express');
const { list, getById, create, update, remove } = require('../controllers/bookController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', authenticate, requireAdmin, create);
router.put('/:id', authenticate, requireAdmin, update);
router.delete('/:id', authenticate, remove);

module.exports = router;
