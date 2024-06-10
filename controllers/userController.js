const User = require('../models/User');

exports.registerUser = (req, res) => {
    const { name, idNumber, phoneNumber } = req.body;

    User.register(name, idNumber, phoneNumber, (err, result) => {
        if (err) {
            return res.status(500).send('Error registering user');
        }
        res.send('User registered successfully');
    });
};
