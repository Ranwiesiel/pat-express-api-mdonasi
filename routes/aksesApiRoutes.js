const express = require('express');
const router = express.Router();
const AksesApiController = require('../controllers/aksesApiController')

router.get('/', AksesApiController.getHistoryAPI);

module.exports = router;
