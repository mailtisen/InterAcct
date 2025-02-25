const axios = require('axios');

const agent1_base_url = 'http://10.14.6.43';
const agent1_port = '8001';
//const agent2_base_url = 'http://10.14.90.76';
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
    const credDefBody = {
        "revocation_registry_size": 1000,
        "schema_id": schemaId,
        "support_revocation": false,
        "tag": "default_8"
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

// async function storeCredential(destinationCredExId) {
//     const storeCredUrl = `${agent2_base_url}:${agent2_port}/issue-credential-2.0/records/${destinationCredExId}/store`;
//     const storeCredHeaders = {
//         'Content-Type': 'application/json'
//     };
//     const storeCredBody = {
//         "credential_id": "string"
//     };

//     console.log('Store Credential Request:');
//     console.log('URL:', storeCredUrl);
//     console.log('Headers:', storeCredHeaders);
//     console.log('Body:', storeCredBody);

//     const storeCredResponse = await axios.post(storeCredUrl, storeCredBody, { headers: storeCredHeaders });

//     console.log('Store Credential Response:', storeCredResponse.data);
// }

async function sendProofRequestSource(sourceConnectionId, credDefId) {
    // Define the request payload
    const payload = {
      "comment": "This is a comment about the reason for the inter-access attribute proof",
      "connection_id": sourceConnectionId,
      "presentation_request": {
        "indy": {
          "name": "Proof of Attributes",
          "version": "1.0",
          "requested_attributes": {
            "0_RequesterName_uuid": {
              "name": "RequesterName",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_RequestId_uuid": {
              "name": "RequestId",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_SourceNetworkID_uuid": {
              "name": "SourceNetworkID",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_DestinationNetworkID_uuid": {
              "name": "DestinationNetworkID",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_RequestType_uuid": {
              "name": "RequestType",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_Signed_uuid": {
              "name": "Signed",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_RequesterApproved_uuid": {
              "name": "RequesterApproved",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            },
            "0_ObjectRequested_uuid": {
              "name": "ObjectRequested",
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            }
          },
          "requested_predicates": {
            "0_RelationValidTill_GE_uuid": {
              "name": "RelationValidTill",
              "p_type": "<=",
              "p_value": 2026,
              "restrictions": [
                {
                  "cred_def_id": credDefId
                }
              ]
            }
          }
        }
      }
    };
  
    try {
      // Send the POST request and await the response
      const response = await axios.post('http://10.14.6.43:8001/present-proof-2.0/send-request', payload);
      
      // Extract the pres_ex_id from the response
      const source_pres_ex_id = response.data.pres_ex_id;
      
      // Return the extracted pres_ex_id
      return source_pres_ex_id;
    } catch (error) {
      console.error('Error occurred:', error);
      throw error; // Rethrow the error after logging it
    }
  }

  async function getProofRecordDestination(destinationConnectionId) {
    const proofRecordDestUrl = `${agent2_base_url}:${agent2_port}/present-proof-2.0/records?connection_id=${destinationConnectionId}`;
    const proofRecordDestHeaders = {
        'Accept': 'application/json'
    };

    console.log('Get Proof Record Destination Request:');
    console.log('URL:', proofRecordDestUrl);
    console.log('Headers:', proofRecordDestHeaders);
    await delay(DELAY_DURATION_MS);


    const proofRecordDestResponse = await axios.get(proofRecordDestUrl, { headers: proofRecordDestHeaders });

    console.log('Get Proof Record Destination Response:', proofRecordDestResponse.data);

    // Check if any record in the response has state "done"
    const records = proofRecordDestResponse.data.results;
    // const isStateDone = records.some(record => record.state === 'done');

    // if (isStateDone) {
    //     console.log('The state is "done" for one of the records.');
    // } else {
    //     console.log('No records with state "done" found.');
    // }
    //console.log('The state is "done" for one of the records.',records);
    console.log('The state is records.',records);
    return proofRecordDestResponse.data;
}
  


async function main() {
    try {
        const { sourceConnectionId, invitation } = await createInvitation();
        const destinationConnectionId = await receiveInvitation(invitation);
        const schemaId = await createSchema(sourceConnectionId);
        const credDefId = await createCredentialDefinition(schemaId);
        await issueCredential(sourceConnectionId, schemaId, credDefId);
        const destinationCredExId = await getDestinationCredExId(); // Capture destination cred_ex_id
        console.log('IssueCrdential Destination cred_ex_id:', destinationCredExId);

           // Not Required
        // await storeCredential(destinationCredExId); // Use destination cred_ex_id in store request
        // Send the proof request using the appropriate parameters
    //     const source_pres_ex_id =await sendProofRequestSource(sourceConnectionId, credDefId); 
       
    //     console.log('source_pres_ex_id:', source_pres_ex_id);
    //     // Fetch the proof record from the destination and check for state "done"
    //    const proofRecordDestination = await getProofRecordDestination(destinationConnectionId);
    //    console.log('Fetched Proof Record Destination:', proofRecordDestination);

         //const source_pres_ex_id = await sendProofRequestSource(credDefId);

        //const sourcepresExId = await sendProofRequest(sourceConnectionId, credDefId);
        //console.log('Proceeding with my source pres_ex_id:', sourcepresExId.presExId);
         // Fetch the proof record using the captured pres_ex_id
        //const proofRecord = await getProofRecord(presExId);
        //console.log('Fetched Proof Record:', proofRecord);

        // Fetch the proof record from the destination and check for state "done"
       // const proofRecordDestination = await getProofRecordDestination(sourceConnectionId);
       // console.log('Fetched Proof Record Destination:', proofRecordDestination);
               
    } catch (error) {
        console.error('Error during process:', error);
    }
}

main();
