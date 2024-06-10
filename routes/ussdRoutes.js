const express = require('express');
const menu = require('../ussd/ussdMenu');

const router = express.Router();

router.post('/', (req, res) => {
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});

module.exports = router;
