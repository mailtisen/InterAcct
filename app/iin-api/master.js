const axios = require('axios');

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

            // Generate the equivalent curl command
            const curlCommand = `curl -X POST "${url}" -H "Content-Type: application/json" -d '${JSON.stringify(requestBody)}'`;
            console.log('Equivalent curl command:', curlCommand);

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

async function main() {
    try {
        const invitationData = await createInvitation();
        if (invitationData) {
            console.log('Received Invitation Data:', invitationData);
        } else {
            console.error('Invalid invitation data received.');
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main();

