const express = require('express');
const bodyParser = require('body-parser');
const ussdRoutes = require('./routes/ussdRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ussd', ussdRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
