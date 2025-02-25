const express = require('express');
const axios = require('axios');
const app = express();
const port = 7000; // Adjust as needed

app.use(express.json());
app.use(express.static('public')); // Serve the static files from 'public' folder

const agent1_base_url = 'http://10.14.6.43';
const agent1_port = '8001';
const agent2_base_url = 'http://10.14.6.44';
const agent2_port = '11001';
const issuer_did = 'VV9pK5ZrLPRwYmotgACPkC';
const DELAY_DURATION_MS = 2000;

// Helper function to introduce a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createInvitation() {
    const createUrl = `${agent1_base_url}:${agent1_port}/connections/create-invitation`;
    const createBody = {};

    console.log('Create Invitation Request:');
    console.log('URL:', createUrl);
    console.log('Body:', createBody);

    const createResponse = await axios.post(createUrl, createBody);

    console.log('Create Invitation Response:', createResponse.data);

    const sourceConnectionId = createResponse.data.connection_id;
    console.log('Source Connection ID:', sourceConnectionId);

    return { sourceConnectionId, invitation: createResponse.data.invitation };
}

async function receiveInvitation(invitation) {
    const receiveUrl = `${agent2_base_url}:${agent2_port}/connections/receive-invitation`;
    const receiveHeaders = {
        'Content-Type': 'application/json'
    };

    console.log('Receive Invitation Request:');
    console.log('URL:', receiveUrl);
    console.log('Headers:', receiveHeaders);
    console.log('Body:', invitation);

    const receiveResponse = await axios.post(receiveUrl, invitation, { headers: receiveHeaders });

    console.log('Receive Invitation Response:', receiveResponse.data);

    const destinationConnectionId = receiveResponse.data.connection_id;
    console.log('Destination Connection ID:', destinationConnectionId);

    return destinationConnectionId;
}

async function createSchema(sourceConnectionId) {
    const schemaUrl = `${agent1_base_url}:${agent1_port}/schemas?conn_id=${sourceConnectionId}`;
    const schemaHeaders = {
        'Content-Type': 'application/json'
    };
    const schemaBody = {
        "attributes": [
            "RequesterName",
            "RequestId",
            "SourceNetworkID",
            "DestinationNetworkID",
            "RequestType",
            "Signed",
            "RequesterApproved",
            "ObjectRequested",
            "RelationValidTill"
        ],
        "schema_name": "interops",
        "schema_version": "0.1"
    };

    console.log('Create Schema Request:');
    console.log('URL:', schemaUrl);
    console.log('Headers:', schemaHeaders);
    console.log('Body:', schemaBody);

    const schemaResponse = await axios.post(schemaUrl, schemaBody, { headers: schemaHeaders });

    console.log('Create Schema Response:', schemaResponse.data);

    return schemaResponse.data.schema_id;
}

async function createCredentialDefinition(schemaId) {
    const credDefUrl = `${agent1_base_url}:${agent1_port}/credential-definitions`;
    const credDefHeaders = {
        'Content-Type': 'application/json'
    };

    // Generate a random number between 1 and 100
    const randomTagNumber = Math.floor(Math.random() * 100) + 1;

    const credDefBody = {
        "revocation_registry_size": 1000,
        "schema_id": schemaId,
        "support_revocation": false,
        "tag": `defaults_${randomTagNumber}` // Use the randomized number in the tag
    };

    console.log('Create Credential Definition Request:');
    console.log('URL:', credDefUrl);
    console.log('Headers:', credDefHeaders);
    console.log('Body:', credDefBody);

    const credDefResponse = await axios.post(credDefUrl, credDefBody, { headers: credDefHeaders });

    console.log('Create Credential Definition Response:', credDefResponse.data);

    return credDefResponse.data.credential_definition_id;
}

async function issueCredential(sourceConnectionId, schemaId, credDefId) {
    const issueCredUrl = `${agent1_base_url}:${agent1_port}/issue-credential-2.0/send`;
    const issueCredHeaders = {
        'Content-Type': 'application/json'
    };
    const issueCredBody = {
        "auto_remove": true,
        "comment": "Issuing credential",
        "connection_id": sourceConnectionId,
        "credential_preview": {
            "@type": "issue-credential/2.0/credential-preview",
            "attributes": [
                { "name": "RequesterName", "value": "TestEmp22" },
                { "name": "RequestId", "value": "11" },
                { "name": "SourceNetworkID", "value": "N1" },
                { "name": "DestinationNetworkID", "value": "N2" },
                { "name": "RequestType", "value": "Individual" },
                { "name": "Signed", "value": "Yes" },
                { "name": "RequesterApproved", "value": "Yes" },
                { "name": "ObjectRequested", "value": "Articles" },
                { "name": "RelationValidTill", "value": "2025" }
            ]
        },
        "filter": {
            "indy": {
                "cred_def_id": credDefId,
                "issuer_did": issuer_did,
                "schema_id": schemaId,
                "schema_issuer_did": issuer_did,
                "schema_name": "interops",
                "schema_version": "0.1"
            }
        },
        "trace": false
    };

    console.log('Issue Credential Request:');
    console.log('URL:', issueCredUrl);
    console.log('Headers:', issueCredHeaders);
    console.log('Body:', issueCredBody);

    const issueCredResponse = await axios.post(issueCredUrl, issueCredBody, { headers: issueCredHeaders });

    console.log('Issue Credential Response:', issueCredResponse.data);

    const credExId = issueCredResponse.data.cred_ex_id;
    console.log('Credential Exchange ID:', credExId);

    return credExId;
}

async function getDestinationCredExId() {
    const getCredExUrl = `${agent2_base_url}:${agent2_port}/issue-credential-2.0/records`;
    const getCredExHeaders = {
        'Accept': 'application/json'
    };

    console.log('Get Credential Exchange Records Request:');
    console.log('URL:', getCredExUrl);

    // Add a delay before sending the request
    console.log('Adding a delay before fetching the credential exchange records...');
    await delay(2000); // 2-second delay

    const getCredExResponse = await axios.get(getCredExUrl, { headers: getCredExHeaders });

    console.log('Get Credential Exchange Records Response:', getCredExResponse.data);

    // Extract the destination cred_ex_id from the response
    const destinationCredExId = getCredExResponse.data.results[0].cred_ex_record.cred_ex_id;
    console.log('Destination Credential Exchange ID:', destinationCredExId);

    return destinationCredExId;
}

async function main(requestId) {
    try {
        console.log('Processing Request ID:', requestId); // Use the requestId as needed
        const { sourceConnectionId, invitation } = await createInvitation();
        const destinationConnectionId = await receiveInvitation(invitation);
        const schemaId = await createSchema(sourceConnectionId);
        const credDefId = await createCredentialDefinition(schemaId);
        await issueCredential(sourceConnectionId, schemaId, credDefId);
        const destinationCredExId = await getDestinationCredExId(); // Capture destination cred_ex_id
        console.log('Issue Credential Destination cred_ex_id:', destinationCredExId);

        return { success: true };
    } catch (error) {
        console.error('Error during process:', error);
        return { success: false, message: error.message };
    }
}

// Web endpoint to handle request from the web page
app.post('/process-exchange', async (req, res) => {
    const requestId = req.body.requestId;
    if (!requestId) {
        return res.json({ success: false, message: 'Request ID is required.' });
    }

    const result = await main(requestId); // Pass requestId to the main function
    res.json(result); // Respond with the result (success or failure)
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
