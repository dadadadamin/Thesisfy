const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/update-info', userController.updateInfo);
router.put('/update-password', userController.updatePassword);

module.exports = router;