
 /* Author    : mailtisen */
 /* Created on: 2024 */
 /* Purpose   : Access Control Management for Interoperable Blockchains */ 


const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

async function connectToNetwork() {
    //const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    const ccpPath = path.resolve(
        '/home/user/Work_TS/fabric_network/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com',
        'connection-org1.json'
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the enrollUser.js application before retrying');
        return null;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true }
    });

    return gateway;
}

// app.post('/check-access', async (req, res) => {
//     const { role, requestType, signature } = req.body;

//     try {
//         const gateway = await connectToNetwork();
//         if (!gateway) {
//             return res.status(500).send('Failed to connect to network');
//         }

//         const network = await gateway.getNetwork('mychannel');
//         const contract = network.getContract('accesscontrol');

//         const result = await contract.evaluateTransaction('CheckAccess', role, requestType, signature.toString());
//         await gateway.disconnect();

//         res.status(200).json({ result: result.toString() });
//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         res.status(500).send(`Failed to evaluate transaction: ${error}`);
//     }
// });

app.post('/check-access', async (req, res) => {
    const requestData = req.body;

    // Log the incoming request data
    console.log('Received check access request data:', requestData);

    try {
        const gateway = await connectToNetwork();
        if (!gateway) {
            console.log('Failed to connect to network');
            return res.status(500).send('Failed to connect to network');
        }

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('access_control_chaincode');

        // Log before submitting the transaction
        console.log('Submitting transaction to check access...');

        const result = await contract.evaluateTransaction('CheckAccess', JSON.stringify(requestData));

        // Log the result from the chaincode
        const accessGranted = result.toString() === 'true';
        console.log('Access granted:', accessGranted);

        await gateway.disconnect();

        // Send the result back to the client
        res.status(200).json({ accessGranted });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).send(`Failed to evaluate transaction: ${error}`);
    }
});

// Endpoint to save access request details to the blockchain and .dat file
app.post('/save-request', async (req, res) => {
    const requestData = req.body;
    

    try {
        const gateway = await connectToNetwork();
        if (!gateway) {
            return res.status(500).send('Failed to connect to network');
        }

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('access_control_chaincode');

        // If requestID is not generated on the client-side, you can generate it here
        if (!requestData.requestID) {
            requestData.requestID = uuid.v4();
        }

        // Submit the request data to the blockchain
       // console.log('Request', JSON.stringify(requestData));
        const result = await contract.submitTransaction('SaveRequestDetails', JSON.stringify(requestData));

        //console.log('Transaction result:', result.toString());
        res.status(200).json({ message: result.toString() });
  


        //console.log('Requested', JSON.stringify(requestData));
        //console.log('Responsed', result.toString);
        await gateway.disconnect();

        //const transactionId = result.toString(); // Assuming the transaction returns the transaction ID

        // Add the transaction ID to the request data and save it to the .dat file
        // requestData.transactionId = transactionId;
        // saveToDatFile(requestData);

        // res.status(200).json({ requestID: requestData.requestID });
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send(`Failed to submit transaction: ${error}`);
    }
});

app.post('/view-requests', async (req, res) => {
    const requestData = req.body;
    const requestID = requestData.requestID || '';

    // Log the incoming request data
    console.log('Received view requests for Request ID:', requestID);

    try {
        const gateway = await connectToNetwork();
        if (!gateway) {
            console.log('Failed to connect to network');
            return res.status(500).send('Failed to connect to network');
        }

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('access_control_chaincode');

        // Log before submitting the query
        console.log('Querying request details...');

        const result = await contract.evaluateTransaction('extractAccessReuest', requestID);

        // Log the result from the chaincode
        console.log('Query result:', result.toString());

        await gateway.disconnect();

        // Send the result back to the client
        res.status(200).json({ requests: JSON.parse(result.toString()) });
    } catch (error) {
        console.error(`Failed to query request details: ${error}`);
        res.status(500).send(`Failed to query request details: ${error}`);
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



