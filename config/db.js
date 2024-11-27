const mysql = require('mysql2');
require('dotenv').config(); // .env 파일 로드




const db = mysql.createConnection({
    host: 'localhost',  // MySQL 호스트
    user: 'root',       // MySQL 사용자명
    password: '0000',   // MySQL 비밀번호
    database: 'thesisfy_db'  // 사용할 데이터베이스
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }
});


/*
const db = mysql.createConnection({

    host: process.env.DATABASE_HOST, // RDS 엔드포인트
    user: process.env.DATABASE_USER, // RDS에서 설정한 사용자명
    password: process.env.DATABASE_PASSWORD, // RDS에서 설정한 비밀번호
    database: process.env.DATABASE_NAME // 데이터베이스 이름
});

db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }
});


*/
