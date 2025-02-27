const express = require('express');
const bodyParser = require('body-parser');
const encryptionRoutes = require('./routes/encryption');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', encryptionRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));