const crypto = require('crypto');
const fs = require('fs');

// Load private keys for signing (ensure these files exist)
const orgHeadPrivateKey = fs.readFileSync('org_head_private.pem', 'utf8');
const directorPrivateKey = fs.readFileSync('director_private.pem', 'utf8');

// Function to generate ECDSA signature
function generateSignature(message, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'base64');
}

// Example usage of generateSignature function
const message = 'Example message to be signed';
const orgHeadSignature = generateSignature(message, orgHeadPrivateKey);
const directorSignature = generateSignature(message, directorPrivateKey);

console.log('Org Head Signature:', orgHeadSignature);
console.log('Director Signature:', directorSignature);
