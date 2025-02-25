/* Import the required modules */
const express = require('express');
const bodyParser = require('body-parser');

/* Create a new instance of the express application */
const app = express();

/* Define the port number to listen on, using the PORT environment variable
if available */
const PORT = process.env.PORT || 6000;

/*Configure the app to use body-parser middleware to parse request bodies */
app.use(express.json());

/* Mount routes */
app.use('/api/v1', router);

/* Start the server and listen on the specified port */
app.listen(port, () => {
  console.log(`Server running on port ${PORT}`);
});
