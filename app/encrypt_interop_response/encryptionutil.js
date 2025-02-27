const { Crypto } = require('node-webcrypto-ossl');
global.crypto = new Crypto(); 

const crypto = require('crypto');
const sss = require('shamirs-secret-sharing');

function splitKey(key, numShares) {
    const bufferKey = Buffer.from(key, 'utf8');
    const shares = sss.split(bufferKey, { shares: numShares, threshold: 2 });
    return shares.map(share => share.toString('hex')); // Convert shares to hex strings
}

function reconstructKey(shares) {
    const bufferShares = shares.map(share => Buffer.from(share, 'hex')); // Convert hex shares to buffers
    const originalKey = sss.combine(bufferShares); // Reconstruct key
    return originalKey.toString('utf8'); // Convert buffer to string
}


function encryptWithAES(plaintext, key) {
    const cipher = crypto.createCipher('aes-128-cbc', key.padEnd(16, '0')); 
    let encrypted = cipher.update(plaintext, 'utf8', 'hex'); // Encrypt the plaintext
    encrypted += cipher.final('hex'); // Finalize encryption
    return encrypted;
}


function decryptWithAES(ciphertext, key) {
    const decipher = crypto.createDecipher('aes-128-cbc', key.padEnd(16, '0')); 
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8'); // Decrypt the ciphertext
    decrypted += decipher.final('utf8'); 
    return decrypted;
}

module.exports = {
    splitKey,
    reconstructKey,
    encryptWithAES,
    decryptWithAES,
};
