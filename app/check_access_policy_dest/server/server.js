const express = require('express');
const bodyParser = require('body-parser');
const requestRoutes = require('./routes/request');

const app = express();
app.use(bodyParser.json());
app.use('/requests', requestRoutes);

const PORT = 6000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
