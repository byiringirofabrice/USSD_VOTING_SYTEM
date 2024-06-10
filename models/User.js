const db = require('../config/db');

const User = {
    register: (name, idNumber, phoneNumber, callback) => {
        const query = 'INSERT INTO users (name, id_number, phone_number) VALUES (?, ?, ?)';
        db.query(query, [name, idNumber, phoneNumber], callback);
    },
    findByPhoneNumber: (phoneNumber, callback) => {
        const query = 'SELECT * FROM users WHERE phone_number = ?';
        db.query(query, [phoneNumber], callback);
    }
};

module.exports = User;
