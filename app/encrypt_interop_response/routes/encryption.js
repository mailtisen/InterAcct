const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { splitKey, reconstructKey, encryptWithAES, decryptWithAES } = require('../encryptionutil');

const router = express.Router();
const ccpPath = path.resolve(__dirname, '..', 'connection-profile.json');
const walletPath = path.resolve(__dirname, '..', 'wallet');

let shares = []; // Temporary storage for generated shares

async function saveToChaincode(record) {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('manageinteroprequest');

    await contract.submitTransaction(
        'SaveEncryptionRecord',
        record.requestId,
        record.requestType,
        JSON.stringify(record.requesters),
        record.encryptedPayload,
        JSON.stringify(record.shares)
    );

    await gateway.disconnect();
    return { success: true };
}

// Route: Generate shares
router.post('/generate-shares', (req, res) => {
    const { key, numShares } = req.body;
    shares = splitKey(key, numShares);
    res.json({ shares });
});

// Route: Encrypt payload
router.post('/encrypt-payload', (req, res) => {
    const { requestType, payload } = req.body;
    const encryptionKey = requestType === 'joint' ? shares.join('') : shares[0];
    const encryptedPayload = encryptWithAES(payload, encryptionKey);
    res.json({ encryptedPayload });
});

router.post('/decrypt-payload', (req, res) => {
    const { requestType, shares, payload } = req.body;

    try {
        let key;
        if (requestType === 'joint') {
            key = reconstructKey(shares); // Reconstruct key from shares
        } else if (requestType === 'single') {
            key = shares[0]; // Use the provided key directly
        } else {
            return res.status(400).json({ error: 'Invalid request type' });
        }

        const decryptedPayload = decryptWithAES(payload, key); // Decrypt the payload
        res.json({ decryptedPayload });
    } catch (error) {
        res.status(500).json({ error: 'Decryption failed', details: error.message });
    }
});

// Route: Save to blockchain
router.post('/save', async (req, res) => {
    const { requestId, requestType, requesters, encryptedPayload } = req.body;
    const result = await saveToChaincode({
        requestId,
        requestType,
        requesters,
        encryptedPayload,
        shares,
    });
    res.json(result);
});

module.exports = router;
