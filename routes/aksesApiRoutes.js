const express = require('express');
const router = express.Router();
const AksesApiController = require('../controllers/aksesApiController')

router.get('/', AksesApiController.getHistoryAPI); //Router Mengarahkan ke Controller

module.exports = router;
