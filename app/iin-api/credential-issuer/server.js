const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const Agent1URL = "http://10.14.6.43:8001";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', async (req, res) => {
    try {
        const connectionId = "26ff8ded-5706-4118-ab22-b2ef192e8e66"; // Hardcoded connection ID
        
        const data = {
            auto_remove: true,
            comment: "string",
            connection_id: connectionId,
            credential_preview: {
                "@type": "issue-credential/2.0/credential-preview",
                "attributes": [
                    { "name": "PersonId", "value": req.body.PersonId },
                    { "name": "PersonName", "value": req.body.PersonName },
                    { "name": "InstituteName", "value": req.body.InstituteName },
                    { "name": "PersonType", "value": req.body.PersonType },
                    { "name": "Department", "value": req.body.Department },
                    { "name": "CourseProgram", "value": req.body.CourseProgram },
                    { "name": "CurrentYearofStudy", "value": req.body.CurrentYearofStudy },
                    { "name": "IdValiditytillYear", "value": req.body.IdValiditytillYear }
                ]
            },
            filter: {
                indy: {
                    cred_def_id: "VV9pK5ZrLPRwYmotgACPkC:3:CL:20:personssss",
                    issuer_did: "VV9pK5ZrLPRwYmotgACPkC",
                    schema_id: "VV9pK5ZrLPRwYmotgACPkC:2:personssss:0.1",
                    schema_issuer_did: "VV9pK5ZrLPRwYmotgACPkC",
                    schema_name: "personssss",
                    schema_version: "0.1"
                }
            },
            trace: false
        };

        await axios.post(`${Agent1URL}/issue-credential-2.0/send`, data);
        
        res.send('Credential Issued Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error issuing credential');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

