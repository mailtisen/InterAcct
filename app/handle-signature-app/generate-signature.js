// const crypto = require('crypto');
// const fs = require('fs');

// // Load private key (ensure it is in PEM format and has the passphrase)
// const privateKey = fs.readFileSync('org_head_private.pem', 'utf8'); // or 'director_private.pem'
// const passphrase = 'pass123'; // Your passphrase

// // Data to be signed
// const data = 'test';

// // Create a Sign object with SHA256
// const sign = crypto.createSign('SHA256');
// sign.update(data);
// sign.end();

// // Generate the signature
// const signature = sign.sign({ key: privateKey, passphrase }, 'base64');

// console.log('Signature:', signature);

const crypto = require('crypto');
const fs = require('fs');

// Load private key and passphrase
const privateKey = fs.readFileSync('org_head_private.pem', 'utf8');
const passphrase = 'pass123';

// Data to be signed
const requestData = {
    requestId: "1",
    requesterName: "TestEmp",
    organizationName: "Org1",
    sourceNetworkId: "N1",
    destinationNetworkId: "N2",
    role: "Employee",
    requestType: "Organizational Request",
    objectRequested: "Conference"
};

// Convert data to string
const dataString = JSON.stringify(requestData);

// Sign the data
const sign = crypto.createSign('SHA256');
sign.update(dataString);
sign.end();
const signature = sign.sign({ key: privateKey, passphrase }, 'base64');

console.log('Data String:', dataString);
console.log('Signature:', signature);

