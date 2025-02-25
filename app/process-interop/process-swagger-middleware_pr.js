const axios = require('axios');

// Define the request payload
const payload = {
  "comment": "This is a comment about the reason for the inter-access attribute proof",
  "connection_id": "95d2cf09-db91-45b0-b93f-4d7bb014b7a8",
  "presentation_request": {
    "indy": {
      "name": "Proof of Attributes",
      "version": "1.0",
      "requested_attributes": {
        "0_RequesterName_uuid": {
          "name": "RequesterName",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_RequestId_uuid": {
          "name": "RequestId",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_SourceNetworkID_uuid": {
          "name": "SourceNetworkID",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_DestinationNetworkID_uuid": {
          "name": "DestinationNetworkID",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_RequestType_uuid": {
          "name": "RequestType",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_Signed_uuid": {
          "name": "Signed",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_RequesterApproved_uuid": {
          "name": "RequesterApproved",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        },
        "0_ObjectRequested_uuid": {
          "name": "ObjectRequested",
          "restrictions": [
            {
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
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
              "cred_def_id": "VV9pK5ZrLPRwYmotgACPkC:3:CL:7:default24"
            }
          ]
        }
      }
    }
  }
};

// Send the POST request and extract pres_ex_id from the response
axios.post('http://10.14.6.43:8001/present-proof-2.0/send-request', payload)
  .then(response => {
    const source_pres_ex_id = response.data.pres_ex_id;
    console.log('source_pres_ex_id:', source_pres_ex_id);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
