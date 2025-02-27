const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle POST request on button click
app.post('/createInvitation', async (req, res) => {
    try {
        // Make POST request to the specified URL
        const response = await axios.post('http://x.x.x.43:12001/');
        
        // Send response back to the client
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

