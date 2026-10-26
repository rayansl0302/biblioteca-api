const express = require('express');
const { get } = require('../controllers/gabaritoController');
const { authenticate, requireMaster } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, requireMaster, get);

module.exports = router;
