const bcrypt = require('bcrypt');
const db = require('../config/db');

// 사용자 정보 수정(직업, 닉네임)
exports.updateInfo = async (req, res) => {
    const { job, nickname } = req.body;

    try {
        // 사용자 이메일 확인 (로그인 상태에서 이메일은 수정 불가)
        const userEmail = req.user.email; // 로그인된 사용자의 이메일 (JWT로 인증된 사용자의 경우)

        if (!userEmail) {
            return res.status(400).json({ error: '로그인이 필요합니다.' });
        }

        // 수정할 데이터 준비
        const updatedFields = {};
        if (job) {
            updatedFields.job = job;
        }
        if (nickname) {
            updatedFields.nickname = nickname;
        }

        // 수정할 항목이 하나라도 있으면 업데이트 쿼리 생성
        if (Object.keys(updatedFields).length > 0) {
            // SQL 동적 생성
            const setClause = Object.keys(updatedFields)
                .map((field) => `${field} = ?`)
                .join(', ');
            const values = Object.values(updatedFields);
            values.push(userEmail); // WHERE 조건에 사용할 email 추가

            const updateQuery = `UPDATE users SET ${setClause} WHERE email = ?`;

            // DB 업데이트 실행
            db.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error('수정 중 오류:', err);
                    return res.status(500).json({ error: '정보 수정 실패' });
                }
                res.status(200).json({ message: '정보 수정 성공!' });
            });
        } else {
            return res.status(400).json({ error: '수정할 정보가 없습니다.' });
        }
    } catch (error) {
        console.error('개인정보 수정 중 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
};


// 비밀번호 변경
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 필요한 값이 모두 존재하는지 확인
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: '모든 필드를 입력해 주세요.' });
    }

    // 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: '새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
    }

    try {
        const userEmail = req.user.email; // 로그인된 사용자의 이메일 (JWT로 인증된 사용자의 경우)

        if (!userEmail) {
            return res.status(400).json({ error: '로그인이 필요합니다.' });
        }

        // 사용자 정보 조회 (현재 비밀번호 확인)
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [userEmail], async (err, results) => {
            if (err) {
                console.error('비밀번호 확인 오류:', err);
                return res.status(500).json({ error: '서버 오류' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            }

            const user = results[0];

            // 현재 비밀번호가 맞는지 확인
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
            }

            // 새로운 비밀번호 해싱
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // 비밀번호 업데이트
            const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
            db.query(updateQuery, [hashedPassword, userEmail], (err, result) => {
                if (err) {
                    console.error('비밀번호 업데이트 오류:', err);
                    return res.status(500).json({ error: '비밀번호 변경 실패' });
                }
                res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
            });
        });
    } catch (error) {
        console.error('비밀번호 수정 중 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
};