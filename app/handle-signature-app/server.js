const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load keys
const privateKeyOrgHead = fs.readFileSync('org_head_private.pem', 'utf8');
const publicKeyOrgHead = fs.readFileSync('org_head_public.pem', 'utf8');
const privateKeyDirector = fs.readFileSync('director_private.pem', 'utf8');
const publicKeyDirector = fs.readFileSync('director_public.pem', 'utf8');
const passphrase = 'pass123'; // Passphrase for encrypted keys

// Function to generate ECDSA signature
function generateSignature(data, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign({ key: privateKey, passphrase }, 'base64');
}

// Endpoint to generate Org Head signature
app.post('/generate-org-head-signature', (req, res) => {
    const requestData = req.body;
    const dataString = JSON.stringify(requestData);

    console.log('Generating Org Head Signature for Data:', dataString);

    const signature = generateSignature(dataString, privateKeyOrgHead);
    console.log('Org Head Signature:', signature);

    res.json({ signature });
});

// Endpoint to generate Director signature
app.post('/generate-director-signature', (req, res) => {
    const requestData = req.body;
    const dataString = JSON.stringify(requestData);

    console.log('Generating Director Signature for Data:', dataString);

    const signature = generateSignature(dataString, privateKeyDirector);
    console.log('Director Signature:', signature);

    res.json({ signature });
});

// Function to verify ECDSA signature
function verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
}

// Endpoint to handle requests and verify signatures
app.post('/submit-request', (req, res) => {
    const {
        requestId,
        requesterName,
        organizationName,
        sourceNetworkId,
        destinationNetworkId,
        role,
        requestType,
        objectRequested,
        orgHeadSignature,
        directorSignature
    } = req.body;

    // Data to be signed
    const requestData = {
        requestId,
        requesterName,
        organizationName,
        sourceNetworkId,
        destinationNetworkId,
        role,
        requestType,
        objectRequested
    };

    // Convert data to string
    const dataString = JSON.stringify(requestData);

    console.log('Request Data:', requestData);
    console.log('Data String:', dataString);
    console.log('Org Head Signature:', orgHeadSignature);
    console.log('Director Signature:', directorSignature);

    // Verify signatures
    const isOrgHeadSignatureValid = verifySignature(dataString, orgHeadSignature, publicKeyOrgHead);
    const isDirectorSignatureValid = verifySignature(dataString, directorSignature, publicKeyDirector);

    console.log('Org Head Signature Valid:', isOrgHeadSignatureValid);
    console.log('Director Signature Valid:', isDirectorSignatureValid);

    // Respond based on signature validity
    if (isOrgHeadSignatureValid && isDirectorSignatureValid) {
        res.status(200).json({ message: 'Request approved and access granted.' });
    } else {
        res.status(400).json({ message: 'Invalid signatures. Access denied.' });
    }
});

// Route to handle root path and serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
