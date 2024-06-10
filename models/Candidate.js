const db = require('../config/db');

const Candidate = {
    getAll: (callback) => {
        const query = 'SELECT * FROM candidates';
        db.query(query, callback);
    }
};

module.exports = Candidate;
