const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 6000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createInvitation() {
    const url = 'http://10.14.6.43:8001/connections/create-invitation';
    const requestBody = {};  // Assuming the request body is empty

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Invitation created successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to create invitation:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error creating invitation:', error);
        throw error;
    }
}

async function receiveInvitation(invitation) {
    const url = 'http://localhost:11001/connections/receive-invitation';

    try {
        const response = await axios.post(url, invitation, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Invitation accepted successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to accept invitation:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error accepting invitation:', error);
        throw error;
    }
}

async function sendMessage(connectionId) {
    const url = `http://10.14.6.43:11001/connections/${connectionId}/send-message`;
    const requestBody = {
        content: "Hello I am 1m from Agent1 TSsss"
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Message sent successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to send message:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

async function issueCredential(connectionId, credentialAttributes) {
    const url = 'http://10.14.6.43:8001/issue-credential-2.0/send';
    const requestBody = {
        auto_remove: true,
        comment: "string",
        connection_id: connectionId,
        credential_preview: {
            "@type": "issue-credential/2.0/credential-preview",
            "attributes": credentialAttributes
        },
        filter: {
            indy: {
                cred_def_id: "VV9pK5ZrLPRwYmotgACPkC:3:CL:14:personss",
                issuer_did: "VV9pK5ZrLPRwYmotgACPkC",
                schema_id: "VV9pK5ZrLPRwYmotgACPkC:2:personss:0.1",
                schema_issuer_did: "VV9pK5ZrLPRwYmotgACPkC",
                schema_name: "personss",
                schema_version: "0.1"
            }
        },
        trace: false
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Credential issued successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to issue credential:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error issuing credential:', error);
        throw error;
    }
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', async (req, res) => {
    const credentialAttributes = [
        { name: "PersonId", value: req.body.PersonId },
        { name: "PersonName", value: req.body.PersonName },
        { name: "InstituteName", value: req.body.InstituteName },
        { name: "PersonType", value: req.body.PersonType },
        { name: "Department", value: req.body.Department },
        { name: "CourseProgram", value: req.body.CourseProgram },
        { name: "CurrentYearofStudy", value: req.body.CurrentYearofStudy },
        { name: "IdValiditytillYear", value: req.body.IdValiditytillYear }
    ];

    try {
        const invitationData = await createInvitation();
        if (invitationData && invitationData.invitation) {
            const invitation = invitationData.invitation;
            const receivedData = await receiveInvitation(invitation);

            // Adding a wait time between receiving invitation and sending a message
            await wait(2000); // wait for 2 seconds

            if (receivedData && receivedData.connection_id) {
                const connectionId = invitationData.connection_id;
                const messageResponse = await sendMessage(connectionId);
                console.log('Received Data:', receivedData);
                console.log('Message Response:', messageResponse);

                // Adding a wait time between sending a message and issuing a credential
                await wait(2000); // wait for 2 seconds

                const credentialResponse = await issueCredential(connectionId, credentialAttributes);
                console.log('Credential Response:', credentialResponse);

                res.status(200).send('Process completed successfully.');
            } else {
                console.error('Invalid connection data received.');
                res.status(500).send('Invalid connection data received.');
            }
        } else {
            console.error('Invalid invitation data received.');
            res.status(500).send('Invalid invitation data received.');
        }
    } catch (error) {
        console.error('Error in processing:', error);
        res.status(500).send('Error in processing.');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

