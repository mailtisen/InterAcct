const axios = require('axios');

async function createInvitation() {
    const url = 'http://x.x.x.43:8001/';
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
            console.error('Failed to createsend:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error creatingsend:', error);
        throw error;
    }
}

async function main() {
    try {
        constsendData = await createInvitation();
        if (invitationData) {
            console.log('Receivedsend Data:',sendData);
        } else {
            console.error('Invalidsend data received.');
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main();

