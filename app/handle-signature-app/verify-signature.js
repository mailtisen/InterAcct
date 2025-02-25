// const crypto = require('crypto');
// const fs = require('fs');

// // Load public key (ensure it is in PEM format)
// const publicKey = fs.readFileSync('org_head_public.pem', 'utf8'); // or 'director_public.pem'

// // Data to be verified
// const data = 'test';

// // Signature to be verified (use the signature generated earlier)
// //const signature = 'base64-encoded-signature-here'; // Replace with actual signature
// const signature = 'MEUCIQD9QvoQM4CUeQCUwaKRboXNUkS3y8gu2TQUJikqOewDPAIgQMStIxeSr/4w82gVpZXZKp6UDghc3+XKs3/s+HeuBYk='; // Replace with actual signature

// // Create a Verify object with SHA256
// const verify = crypto.createVerify('SHA256');
// verify.update(data);
// verify.end();

// // Verify the signature
// const isValid = verify.verify(publicKey, signature, 'base64');

// console.log('Signature Valid:', isValid);

const crypto = require('crypto');
const fs = require('fs');

// Load public key
const publicKey = fs.readFileSync('org_head_public.pem', 'utf8');

// Data to be verified
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

// Signature to be verified
//////const signature = 'base64-encoded-signature-here'; // Replace with the signature from `generate-signature.js`
const signature = 'MEYCIQC0stWzBsb2k4fP/m982iXDm1JWzOGpf7UeMOLQwLefdgIhAMEz/Sr117IylwGK3eUrxxgCenuPmbjTkhCbe1pVSvEl'; 
// Verify the signature
const verify = crypto.createVerify('SHA256');
verify.update(dataString);
verify.end();
const isValid = verify.verify(publicKey, signature, 'base64');

console.log('Data String:', dataString);
console.log('Signature:', signature);
console.log('Signature Valid:', isValid);

