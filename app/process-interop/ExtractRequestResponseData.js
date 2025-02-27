const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Gateway, Wallets } = require('fabric-network');

const ccpPath = path.resolve(__dirname, 'connection-org1.json');

// Function to fetch data from external API
async function fetchData() {
  try {
    const response = await axios.get('http://x.x.x.44:5000/response/req=12');

    console.log("Response from GET request:");
    console.log(JSON.stringify(response.data, null, 2)); 

    const data = JSON.stringify(response.data, null, 2);

    const requestTypeMatch = data.match(/"name"\s*:\s*"RequestType"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const requestType = requestTypeMatch ? requestTypeMatch[1] : "Not found";

    const sourceNetworkIDMatch = data.match(/"name"\s*:\s*"SourceNetworkID"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const sourceNetworkID = sourceNetworkIDMatch ? sourceNetworkIDMatch[1] : "Not found";

    const objectRequestedMatch = data.match(/"name"\s*:\s*"ObjectRequested"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const objectRequested = objectRequestedMatch ? objectRequestedMatch[1] : "Not found";

    const requesterApprovedMatch = data.match(/"name"\s*:\s*"RequesterApproved"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const requesterApproved = requesterApprovedMatch ? requesterApprovedMatch[1] : "Not found";

    const signedMatch = data.match(/"name"\s*:\s*"Signed"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const signed = signedMatch ? signedMatch[1] : "Not found";

    const destinationNetworkIDMatch = data.match(/"name"\s*:\s*"DestinationNetworkID"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const destinationNetworkID = destinationNetworkIDMatch ? destinationNetworkIDMatch[1] : "Not found";

    const requestIdMatch = data.match(/"name"\s*:\s*"RequestId"\s*,\s*"value"\s*:\s*"([^"]*)"/);
    const requestId = requestIdMatch ? requestIdMatch[1] : "Not found";

    const statusMatch = data.match(/"status":\s*"(.*?)"/);
    const status = statusMatch ? statusMatch[1] : "Not found";

    console.log("Extracted RequestType:", requestType);
    console.log("Extracted SourceNetworkID:", sourceNetworkID);
    console.log("Extracted ObjectRequested:", objectRequested);
    console.log("Extracted RequesterApproved:", requesterApproved);
    console.log("Extracted Signed:", signed);
    console.log("Extracted DestinationNetworkID:", destinationNetworkID);
    console.log("Extracted RequestId:", requestId);
    console.log("Extracted State:", status);

    await queryAccessRequests(); // Call Hyperledger Fabric chaincode function

  } catch (error) {
    console.error('Error making GET request:', error);
  }
}

// Function to query stored access requests from Hyperledger Fabric chaincode
async function queryAccessRequests() {
  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('appUser');
    if (!identity) {
      console.log('Identity for the user "appUser" not found. Run the enrollment script.');
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mychaincode');

    console.log("Querying stored access requests from the ledger...");
    const result = await contract.evaluateTransaction('extractAccessRequest');
    
    console.log("Stored Access Requests:", JSON.parse(result.toString()));

    await gateway.disconnect();
  } catch (error) {
    console.error('Error querying chaincode:', error);
  }
}

// Call the function
fetchData();
