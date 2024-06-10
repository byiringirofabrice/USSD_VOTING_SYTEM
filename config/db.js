const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'bj1fyu0rl879l8hglbrg-mysql.services.clever-cloud.com',
    user: 'uc37ywczgykftdmc',
    password: 'FjZbcHxJWqrvxT1UhoaW',
    database: 'bj1fyu0rl879l8hglbrg'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

module.exports = db;
