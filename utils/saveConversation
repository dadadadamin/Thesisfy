const db = require('../config/db');

const saveConversation = (userId, message) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO chatopenai (user_id, message) VALUES (?, ?)';
        db.query(query, [userId, message], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

module.exports = saveConversation;