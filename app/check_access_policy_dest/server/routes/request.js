const express = require('express');
const { connectToFabric } = require('../utils/fabricUtils');

const router = express.Router();

// Fetch details by Request ID
router.post('/fetch-details', async (req, res) => {
    try {
        const { requestId } = req.body;

        const gateway = await connectToFabric();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('checkaccess');

        const result = await contract.evaluateTransaction('QueryDetails', requestId);
        const details = JSON.parse(result.toString());

        await gateway.disconnect();
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check access
router.post('/check-access', async (req, res) => {
    try {
        const { requestId } = req.body;

        const gateway = await connectToFabric();
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('checkaccess');

        const result = await contract.evaluateTransaction('checkAccessResponder', requestId);

        await gateway.disconnect();
        res.status(200).json({ message: result.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
