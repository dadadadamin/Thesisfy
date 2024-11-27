const db = require('../config/db'); // DB 연결

// 북마크 저장
exports.addBookmark = async (req, res) => {
    const { userId, title, authors, affiliation, abstract, url } = req.body;    //userId,제목,저자,저자 소속기관,초록,url

    if (!userId || !title || !url) {
        return res.status(400).json({ error: '필수 정보(userId, title, url)를 입력해주세요.' });
    }

    try {
        const query = `
            INSERT INTO bookmarks (user_id, title, authors, affiliation, abstract, url)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [userId, title, authors, affiliation, abstract, url];

        // DB에 데이터 삽입
        db.query(query, values, (err, results) => {
            if (err) {
                console.error('북마크 추가 오류:', err);
                return res.status(500).json({ error: '북마크 추가 실패' });
            }
            res.status(201).json({ message: '북마크 추가 성공!', bookmarkId: results.insertId });
        });
    } catch (error) {
        console.error('북마크 처리 중 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
};

// 북마크 조회
exports.getBookmarks = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: '사용자 ID(userId)가 필요합니다.' });
    }

    try {
        const query = 'SELECT * FROM bookmarks WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('북마크 조회 오류:', err);
                return res.status(500).json({ error: '북마크 조회 실패' });
            }
            res.status(200).json({ bookmarks: results });
        });
    } catch (error) {
        console.error('북마크 조회 중 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
};


// 북마크 삭제
exports.deleteBookmark = async (req, res) => {
    const { bookmarkId } = req.body;

    if (!bookmarkId) {
        return res.status(400).json({ error: '북마크 ID(bookmarkId)가 필요합니다.' });
    }

    try {
        const query = 'DELETE FROM bookmarks WHERE id = ?';
        db.query(query, [bookmarkId], (err, results) => {
            if (err) {
                console.error('북마크 삭제 오류:', err);
                return res.status(500).json({ error: '북마크 삭제 실패' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: '북마크를 찾을 수 없습니다.' });
            }

            res.status(200).json({ message: '북마크 삭제 성공!' });
        });
    } catch (error) {
        console.error('북마크 삭제 중 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
};