document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateOrgHeadSignature').addEventListener('click', async function() {
        const requestId = document.getElementById('requestId').value;
        const requesterName = document.getElementById('requesterName').value;
        const organizationName = document.getElementById('organizationName').value;
        const sourceNetworkId = document.getElementById('sourceNetworkId').value;
        const destinationNetworkId = document.getElementById('destinationNetworkId').value;
        const role = document.getElementById('role').value;
        const requestType = document.getElementById('requestType').value;
        const objectRequested = document.getElementById('objectRequested').value;

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

        console.log('Request Data for Org Head Signature:', requestData);

        try {
            const response = await fetch('/generate-org-head-signature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Org Head Signature:', data.signature);
            document.getElementById('orgHeadSignature').value = data.signature;
        } catch (error) {
            console.error('Error generating Org Head signature:', error);
        }
    });

    document.getElementById('generateDirectorSignature').addEventListener('click', async function() {
        const requestId = document.getElementById('requestId').value;
        const requesterName = document.getElementById('requesterName').value;
        const organizationName = document.getElementById('organizationName').value;
        const sourceNetworkId = document.getElementById('sourceNetworkId').value;
        const destinationNetworkId = document.getElementById('destinationNetworkId').value;
        const role = document.getElementById('role').value;
        const requestType = document.getElementById('requestType').value;
        const objectRequested = document.getElementById('objectRequested').value;

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

        console.log('Request Data for Director Signature:', requestData);

        try {
            const response = await fetch('/generate-director-signature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Director Signature:', data.signature);
            document.getElementById('directorSignature').value = data.signature;
        } catch (error) {
            console.error('Error generating Director signature:', error);
        }
    });

    document.getElementById('submitRequest').addEventListener('click', async function() {
        const requestId = document.getElementById('requestId').value;
        const requesterName = document.getElementById('requesterName').value;
        const organizationName = document.getElementById('organizationName').value;
        const sourceNetworkId = document.getElementById('sourceNetworkId').value;
        const destinationNetworkId = document.getElementById('destinationNetworkId').value;
        const role = document.getElementById('role').value;
        const requestType = document.getElementById('requestType').value;
        const objectRequested = document.getElementById('objectRequested').value;
        const orgHeadSignature = document.getElementById('orgHeadSignature').value;
        const directorSignature = document.getElementById('directorSignature').value;

        const requestData = {
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
        };

        console.log('Submit Request Data:', requestData);

        try {
            const response = await fetch('/submit-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error submitting request:', error);
        }
    });
});
