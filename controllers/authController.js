const bcrypt=require('bcrypt');
const db=require('../config/db');

// 회원가입
exports.register = async (req, res) => {
    const { email, password, nickname, job } = req.body;

    try {
        //비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        //사용자 정보 DB에 삽입
        const query = 'INSERT INTO users (email, password, nickname, job) VALUES (?, ?, ?, ?)';
        await db.query(query, [email, hashedPassword, nickname, job]);
        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ error: '회원가입 실패' });
    }
};

// 로그인
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.query(query, [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }

        res.status(200).json({

            message: '로그인 성공!',
            user: { id: user.id, email: user.email, nickname: user.nickname, job: user.job },
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
};

// 로그아웃
exports.logout = (req, res) => {
    res.status(200).json({ message: '로그아웃 성공!' });
};

//회원탈퇴
exports.delete = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 사용자 조회
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: '서버 오류' });

            if (results.length === 0) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

            const user = results[0];

            //비밀번호 검증
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: '비밀번호가 잘못되었습니다.' });

            //사용자 삭제
            const deleteQuery = 'DELETE FROM users WHERE email = ?';
            db.query(deleteQuery, [email], (err) => {
                if (err) return res.status(500).json({ error: '회원탈퇴 실패' });
                res.status(200).json({ message: '회원탈퇴 성공!' });
            });
        });
    } catch (error) {
        console.error('회원탈퇴 처리 중 오류:', error);  //나중에 지워도 되는 줄
        res.status(500).json({ error: '서버 오류' });
    }
};