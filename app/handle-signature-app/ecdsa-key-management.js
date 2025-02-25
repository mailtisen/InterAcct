const crypto = require('crypto');
const fs = require('fs');

const signMessage = (filenamePrefix, message) => {
    const privateKey = fs.readFileSync(`${filenamePrefix}_private.pem`, 'utf8');
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    console.log(`${filenamePrefix} Signature:\n`, signature);
    return signature;
};

const message = `Request ID: 123
Requester Name: TestEmp
Organization Name: Org1
Source Network ID: N1
Destination Network ID: N2
Role: Employee
Request Type: Organizational Request
Object Requested: Conference`;

signMessage('org_head', message);
signMessage('director', message);
