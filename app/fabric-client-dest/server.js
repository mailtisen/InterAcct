const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function main() {
    try {
        //const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        
        const ccpPath = path.resolve(
            '//proj_fabric/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com',
            'connection-org1.json'
        );
        
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('articlechaincode');

        app.get('/', (req, res) => {
            res.render('index');
        });

        app.post('/submit', async (req, res) => {
            const { id, name, url, type } = req.body;
            await contract.submitTransaction('CreateArticle', id, name, url, type);
            res.redirect('/');
        });

        app.get('/search', async (req, res) => {
            const result = await contract.evaluateTransaction('QueryAllArticles');
            const articles = JSON.parse(result.toString());
            res.render('search', { articles });
        });

    
        app.get('/checkaccess', async (req, res) => {
            const result = await contract.evaluateTransaction('checkAccessResponder');
            const articles = JSON.parse(result.toString());
            res.render('search', { articles });
        });
        

        app.get('/articles', async (req, res) => {
            try {
                const contract = await getContract();
                const result = await contract.evaluateTransaction('QueryAllArticles');
                const articles = JSON.parse(result.toString());
                console.log('Retrieved articles:', articles); // Debugging line
                res.render('search', { articles });
            } catch (error) {
                console.error(`Failed to query chaincode: ${error}`);
                res.status(500).send(error.toString());
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();


