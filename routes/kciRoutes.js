const express = require('express');
const router = express.Router();
const kciController = require('../controllers/kciController');

// KCI 검색 API
router.get('/search', kciController.searchKci);
router.get('/article-detail', kciController.getArticleDetail);

module.exports = router;