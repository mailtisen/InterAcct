const crypto = require('crypto');
const fs = require('fs');

// Function to generate ECDSA key pairs and save to files
function generateKeys(filenamePrefix) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'pass123', // Replace with your passphrase
        },
    });

    fs.writeFileSync(`${filenamePrefix}_private.pem`, privateKey);
    fs.writeFileSync(`${filenamePrefix}_public.pem`, publicKey);

    console.log(`Generated ${filenamePrefix} keys.`);
}

// Generate keys for Org Head and Director
generateKeys('org_head');
generateKeys('director');
