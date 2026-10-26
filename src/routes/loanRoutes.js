const express = require('express');
const { list, getById, create, returnLoan } = require('../controllers/loanController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', list);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id/return', returnLoan);

module.exports = router;
