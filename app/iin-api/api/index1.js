const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // You can change this port to your desired port number
//app.use(express.json());
app.use(bodyParser.json());
// Endpoint to receive webhook notifications
app.post('/webhooks', (req, res) => {
  // Process the incoming webhook payload
  const payload = req.body;
  console.log('Received webhook payload:', payload);


  // Respond with a success message
  res.status(200).send('Webhook received successfully');
});

app.post('/webhooks/topic/connections', (req, res) => {
  // Process the incoming webhook payload
  const payload = req.body;
  console.log('Received webhook payload:', payload);
  

  // Respond with a success message
  res.status(200).send('Webhook received successfully');
});


app.post('/webhooks/topic/present_proof_v2_0', (req, res) => {
  // Process the incoming webhook payload
  const payload = req.body;
  var presentation_proof_event = req.body
  console.log('Received webhook payload:', payload); 
  console.log('values:', req.body.verified);
  // Check if the 'verified' property exists in the payload object
// Check if the 'verified' property exists in the payload object

    // Perform a conditional check to determine if the value is true or false
    if (payload.state == 'done') {
        console.log('The presentation proof is verified.');
    } 
 else {
    console.log('presentaion not verified');

}
});
//app.post('/webhooks/topic/present_proof_v2_0', (req, res) => {
  // Process the incoming webhook payload
 // const payload = req.body;
  //console.log('Received webhook payload:', payload);


  // Respond with a success message
  //res.status(200).send('Webhook received successfully');
//});


app.post('/webhooks/topic/basicmessages', (req, res) => {
  // Process the incoming webhook payload
  const payload = req.body;
  console.log('Received webhook payload:', payload);
  

  // Respond with a success message
  res.status(200).send('Webhook received successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

