const db = require('../config/db');

const Vote = {
    castVote: (userId, position, candidateId, callback) => {
        const query = 'INSERT INTO votes (user_id, position, candidate_id) VALUES (?, ?, ?)';
        db.query(query, [userId, position, candidateId], callback);
    },
    checkVote: (userId, position, callback) => {
        const query = 'SELECT * FROM votes WHERE user_id = ? AND position = ?';
        db.query(query, [userId, position], callback);
    },
    countVotes: (position, candidateId, callback) => {
        const query = 'SELECT COUNT(*) AS votes FROM votes WHERE position = ? AND candidate_id = ?';
        db.query(query, [position, candidateId], callback);
    }
};

module.exports = Vote;
