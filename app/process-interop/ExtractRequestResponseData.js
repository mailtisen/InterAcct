const axios = require('axios');

// Function to make the GET request and print the response
async function fetchData() {
  try {
    const response = await axios.get('http://10.14.6.44:5000/response/req=12');

    // Print the entire response data to the console
    console.log("Response from GET request:");
    console.log(JSON.stringify(response.data, null, 2)); 

    // Convert the response data to a string for regex matching
    const data = JSON.stringify(response.data, null, 2);

    // Extract cred_ex_id (Removed issue-credential reference)
    const credExIdMatch = data.match(/"cred_ex_id":\s*"(.*?)"/);
    const credExId = credExIdMatch ? credExIdMatch[1] : "Not found";
    console.log("Extracted cred_ex_id:", credExId);

    // Extract RequestType
    const requestTypeMatch = data.match(/"name"\s*:\s*"RequestType"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const requestType = requestTypeMatch ? requestTypeMatch[1] : "Not found";
    console.log("Extracted RequestType:", requestType);

    // Extract SourceNetworkID
    const sourceNetworkIDMatch = data.match(/"name"\s*:\s*"SourceNetworkID"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const sourceNetworkID = sourceNetworkIDMatch ? sourceNetworkIDMatch[1] : "Not found";
    console.log("Extracted SourceNetworkID:", sourceNetworkID);

    // Extract ObjectRequested
    const objectRequestedMatch = data.match(/"name"\s*:\s*"ObjectRequested"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const objectRequested = objectRequestedMatch ? objectRequestedMatch[1] : "Not found";
    console.log("Extracted ObjectRequested:", objectRequested);

    // Extract RequesterApproved
    const requesterApprovedMatch = data.match(/"name"\s*:\s*"RequesterApproved"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const requesterApproved = requesterApprovedMatch ? requesterApprovedMatch[1] : "Not found";
    console.log("Extracted RequesterApproved:", requesterApproved);

    // Extract Signed
    const signedMatch = data.match(/"name"\s*:\s*"Signed"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const signed = signedMatch ? signedMatch[1] : "Not found";
    console.log("Extracted Signed:", signed);

    // Extract DestinationNetworkID
    const destinationNetworkIDMatch = data.match(/"name"\s*:\s*"DestinationNetworkID"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const destinationNetworkID = destinationNetworkIDMatch ? destinationNetworkIDMatch[1] : "Not found";
    console.log("Extracted DestinationNetworkID:", destinationNetworkID);

    // Extract RequestId
    const requestIdMatch = data.match(/"name"\s*:\s*"RequestId"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const requestId = requestIdMatch ? requestIdMatch[1] : "Not found";
    console.log("Extracted RequestId:", requestId);

    // Extract state
    const statusMatch = data.match(/"status":\s*"(.*?)"/);
    const status= statusMatch ? statusMatch[1] : "Not found";
    console.log("Extracted state:", state);

  } catch (error) {
    console.error('Error making GET request:', error);
  }
}

// Call the function
fetchData();
