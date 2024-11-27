const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');

// 북마크 추가
router.post('/add', bookmarkController.addBookmark);

// 북마크 조회
router.get('/list', bookmarkController.getBookmarks);

// 북마크 삭제
router.delete('/delete', bookmarkController.deleteBookmark);

module.exports = router;